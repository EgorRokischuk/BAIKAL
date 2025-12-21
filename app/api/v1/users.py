from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from starlette import status
from fastapi.responses import HTMLResponse, RedirectResponse


from db.models import EmailVerification


from jose import jwt

from core.security import verify_password, create_access_token, create_refresh_token, create_new_tokens, create_verification_token
from db.CRUD import get_user_by_login, create_user, get_user_by_email, verify_user, get_user_by_login_or_email
from db.database import get_db
from schemas.users import UserOut, UserCreate, UserProfile, GettingToken, GettingRefreshToken, PasswordResetConfirm

from core.security import oauth2_scheme

from core.security import verify_token

from db.CRUD import get_current_active_user, get_user_by_id, create_verification_request, mark_verification_request_as_used, create_password_reset_token, get_valid_reset_token, mark_reset_token_as_used, update_user_password

from api.v1.GEE import send_email, send_verification_email, send_password_reset_email

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY


user_router = APIRouter()


@user_router.post('/register') #UserOut
async def register_new_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_login(user.login, db)

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")


    # Генерация verivication токена
    verification_token = create_verification_token(data={
        "sub": user.mail,
        "type": "verification"
        })


    #создание запроса на верификацию почты и добавление его в бд
    verification_request = EmailVerification(
        email=user.mail,
        code=verification_token,
        is_used=False
    )




    #отправлка кода на почту
    #await send_email(user.mail, verification_token)
    await send_verification_email(user.mail, verification_token)

    await create_verification_request(verification_request, db)
    await create_user(user, db)

    return {'message': 'Verification code sent successfully'}



@user_router.get('/verify_email/{token}')# path parameter
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_email = payload.get("sub")
    user = await get_user_by_email(user_email, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.locked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    await mark_verification_request_as_used(token, db)

    await verify_user(user, db)

    # Редирект на страницу успеха
    return RedirectResponse(
            url="https://baikal.ict.nsc.ru",
            status_code=302
        )


@user_router.post('/resend_verification_code')
async def resend_verification_code(email: str, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(email, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.locked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    # Генерация verivication токена
    verification_token = create_verification_token(data={
        "sub": user.mail,
        "type": "verification"
        })


    #создание запроса на верификацию почты и добавление его в бд
    verification_request = EmailVerification(
        email=user.mail,
        code=verification_token,
        is_used=False
    )

    try:
        await create_verification_request(verification_request, db)
    except Exception as e:
        raise HTTPException(detail=str(e))

    #отправлка кода на почту
    #await send_email(user.mail, verification_token)
    await send_verification_email(user.mail, verification_token)

    return {'message': 'Verification code sent successfully'}


@user_router.post("/password_reset/request")
async def request_password_reset(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Запрос на восстановление пароля
    """
    # Ищем пользователя по email
    
    user = await get_user_by_email(email, db)
    print(user)
    
    # Всегда возвращаем одинаковый ответ для безопасности
    if not user:
        return {
            "message": "Если email зарегистрирован в системе, инструкции по восстановлению пароля будут отправлены на указанный адрес"
        }
    
    if user.roles_id == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email не подтвержден. Сначала подтвердите email."
        )
    
    # Создаем токен сброса пароля
    reset_token = await create_password_reset_token(email, db)
    
    # Отправляем email с ссылкой для сброса
    await send_password_reset_email(email, reset_token)
    
    return {
        "message": "Если email зарегистрирован в системе, инструкции по восстановлению пароля будут отправлены на указанный адрес"
    }



@user_router.post("/password_reset/confirm")
async def confirm_password_reset(
    request: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """
    Подтверждение сброса пароля с новым паролем
    """
    # Проверяем валидность токена
    token_record = await get_valid_reset_token(request.token, db)
    
    if not token_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный или просроченный токен восстановления"
        )
    
    # Ищем пользователя
    user = await get_user_by_email(token_record.email, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    # Проверяем длину пароля
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пароль должен содержать минимум 8 символов"
        )
    
    try:
        # Обновляем пароль пользователя
        await update_user_password(token_record.email, request.new_password, db)
        
        # Помечаем токен как использованный
        await mark_reset_token_as_used(request.token, db)
        
        return {"message": "Пароль успешно изменен"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при изменении пароля: {str(e)}"
        )
    

# Авторизация пользователя. Эндпоинт для получения токена
@user_router.post("/token") #credentials: GettingToken OAuth2PasswordRequestForm=Depends()
async def login_for_access_token(credentials: GettingToken, db: Session = Depends(get_db)):
    
    user = await get_user_by_login_or_email(credentials.username, db)


    print(user.login + '      ' + user.mail)

    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,   #требование фронтендера
            detail="Invalid credentials",
            headers={"Authorization": "Bearer"},
        )
    
    #if user.roles_id == 1: #неавторизованный пользователь
    #        raise HTTPException(
    #        status_code=status.HTTP_403_FORBIDDEN,
    #        detail="Email not verified."
    #    )


    # Генерация access токена
    access_token = create_access_token(data={
        "sub": user.login, 
        "type": "access"
        })

    # генерация refresh токена
    refresh_token = create_refresh_token(data={"sub": user.login})

    return {"token_type": "bearer", "access_token": access_token, "refresh_token": refresh_token}

# обновление токенов
@user_router.post('/refresh')
async def refresh_tokens(refresh_token: GettingRefreshToken):
    tokens = await create_new_tokens(refresh_token.refresh_token)
    return tokens


@user_router.get("/me", response_model=UserProfile)
async def protected_endpoint(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    user, role = await get_current_active_user(token, db)
    roles = []
    roles.append(role)
    '''  
    roles.append(role)
    if user.roles_id == 1:
        roles.append("не авторизованный пользователь")
    elif user.roles_id == 2:
        roles.append("Авторизованный пользователь")
    elif user.roles_id == 3:
        roles.append("Администратор")
    else: raise HTTPException(status_code=400, detail="Role doesnt exist")
    '''
    profile = UserProfile(
        fio = user.fio,
        login=user.login,
        mail=user.mail,
        phone_number=user.phone_number,
        date_created=user.date_created,
        roles=roles,  # Используем название роли вместо roles_id
        locked=user.locked
    )
    return profile


# Эндпоинт для получения пользователя по ID
#@user_router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Получение информации о пользователе по ID
    """

    user = await get_user_by_id(user_id, db)  # Замените на вашу функцию

    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"User with ID {user_id} not found"
        )

    return user
