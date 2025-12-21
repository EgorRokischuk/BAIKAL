import os

from fastapi import APIRouter, Depends, Query, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db

from core.utils import find_directory, get_mapping_dicts, find_temp_range, get_min_max_temp

from starlette.responses import FileResponse

from db.CRUD import get_landsat_link, get_monthly_avg_file_link, get_monthly_avg_many_years_file_link

from db.CRUD import get_available_dates_for_firstSD, get_available_dates_for_secondSD, get_available_dates_for_thirdSD

from db.CRUD import get_temperature_by_coordinates_monthly_avg, get_temperature_by_coordinates_monthly_avg_many_years, get_temperature_by_coordinates_landsat
from core.security import oauth2_scheme

chlorofill_data_router = APIRouter() # common endpoints



# роут для получения ссылки конкретного объекта из бд по параметрам
@chlorofill_data_router.get('/get_chlorofill_link')
async def find_the_link_to_landsat_file():
    full_path = "/u/product/chlorofil/color_tiles/sentinel2/Baikal_OC2_06-07_1000mp"
    result = full_path + "/{z}/{x}/{-y}.png"

    # date_range = find_temp_range(full_path)
    # min_temp = date_range['min_temp']
    # max_temp = date_range['max_temp']
    # print(f'min: {min_temp}\nmax: {max_temp}')

    #mint, maxt = get_min_max_temp(full_path)
    #print(f'real min: {mint}\nreal max: {maxt}')

    return {"link": result}
