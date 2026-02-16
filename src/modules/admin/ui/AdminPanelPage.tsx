import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { MOCK_EXTERNAL_RESOURCES } from '@/modules/external-resources/model/mockExternalResources';
import type { ExternalResource } from '@/modules/external-resources/model/types';
import { MOCK_PUBLICATIONS } from '@/modules/publications/model/mockPublications';
import type { Publication } from '@/modules/publications/model/types';
import { AppRole } from '@/shared/constants/roles';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { hasAdminRights } from '@/shared/lib/roles';
import { getJsonFromStorage, setToStorage } from '@/shared/lib/storage';
import { useAppDispatch } from '@/store/hooks';
import { appActions } from '@/store/slices/appSlice';
import styles from './AdminPanelPage.module.scss';

type AdminTab = 'publications' | 'resources' | 'guide' | 'about' | 'users';

interface AdminTextRecord {
  id: string;
  title: string;
  content: string;
}

interface AdminUserRecord {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  locked: boolean;
}

interface UserDraft {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface MockAuthStorageUser {
  login?: unknown;
  profile?: {
    fullname?: unknown;
    username?: unknown;
    email?: unknown;
    phoneNumber?: unknown;
    userRights?: unknown;
  };
}

const DEFAULT_GUIDE_RECORDS: AdminTextRecord[] = [
  {
    id: 'guide-1',
    title: 'Работа с картой',
    content: 'Настройка параметров, отображение слоя, скачивание файлов, управление легендой.',
  },
  {
    id: 'guide-2',
    title: 'Сравнение дат',
    content: 'Включение режима сравнения, синхронизация окон карты и разбор различий.',
  },
];

const DEFAULT_ABOUT_RECORDS: AdminTextRecord[] = [
  {
    id: 'about-1',
    title: 'Цель проекта',
    content: 'Мониторинг акватории озера Байкал по спутниковым и наземным данным.',
  },
  {
    id: 'about-2',
    title: 'Ключевые возможности',
    content: 'Продукты, сравнение дат, наземные данные, публикации и внешние ресурсы.',
  },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const usePersistedState = <T,>(key: string, fallback: () => T) => {
  const [state, setState] = useState<T>(() => {
    const stored = getJsonFromStorage<T>(key);
    return stored ?? fallback();
  });

  useEffect(() => {
    setToStorage(key, state);
  }, [key, state]);

  return [state, setState] as const;
};

const parseMockUsers = (): AdminUserRecord[] => {
  const stored = getJsonFromStorage<unknown>(STORAGE_KEYS.mockAuthUsers);
  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .map((item): AdminUserRecord | null => {
      if (!item || typeof item !== 'object') return null;
      const candidate = item as MockAuthStorageUser;
      if (!candidate.profile || typeof candidate.profile !== 'object') return null;

      const username =
        (typeof candidate.profile.username === 'string' && candidate.profile.username.trim()) ||
        (typeof candidate.login === 'string' && candidate.login.trim()) ||
        '';

      if (!username) return null;

      const rights = Array.isArray(candidate.profile.userRights)
        ? candidate.profile.userRights.filter((value): value is string => typeof value === 'string')
        : [];

      return {
        id: createId(),
        fullname:
          typeof candidate.profile.fullname === 'string' && candidate.profile.fullname.trim()
            ? candidate.profile.fullname.trim()
            : username,
        username,
        email: typeof candidate.profile.email === 'string' ? candidate.profile.email : '',
        phoneNumber: typeof candidate.profile.phoneNumber === 'string' ? candidate.profile.phoneNumber : '',
        role: hasAdminRights(rights) ? AppRole.ADMIN : AppRole.AUTHORIZED,
        locked: false,
      };
    })
    .filter((item): item is AdminUserRecord => Boolean(item));
};

const defaultUsers = (): AdminUserRecord[] => {
  const fromStorage = parseMockUsers();
  if (fromStorage.length) {
    return fromStorage;
  }

  return [
    {
      id: 'admin-default',
      fullname: 'Администратор системы',
      username: 'admin',
      email: 'admin@baikal.local',
      phoneNumber: '+7 (000) 000-00-01',
      role: AppRole.ADMIN,
      locked: false,
    },
    {
      id: 'user-default',
      fullname: 'Пользователь системы',
      username: 'user',
      email: 'user@baikal.local',
      phoneNumber: '+7 (000) 000-00-02',
      role: AppRole.AUTHORIZED,
      locked: false,
    },
  ];
};

const countAdmins = (users: AdminUserRecord[]) => users.filter((user) => hasAdminRights([user.role])).length;

export const AdminPanelPage = () => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<AdminTab>('publications');

  const [publications, setPublications] = usePersistedState<Publication[]>(STORAGE_KEYS.adminPublications, () => [
    ...MOCK_PUBLICATIONS,
  ]);
  const [resources, setResources] = usePersistedState<ExternalResource[]>(
    STORAGE_KEYS.adminExternalResources,
    () => [...MOCK_EXTERNAL_RESOURCES],
  );
  const [guideRecords, setGuideRecords] = usePersistedState<AdminTextRecord[]>(
    STORAGE_KEYS.adminGuideRecords,
    () => [...DEFAULT_GUIDE_RECORDS],
  );
  const [aboutRecords, setAboutRecords] = usePersistedState<AdminTextRecord[]>(
    STORAGE_KEYS.adminAboutRecords,
    () => [...DEFAULT_ABOUT_RECORDS],
  );
  const [users, setUsers] = usePersistedState<AdminUserRecord[]>(STORAGE_KEYS.adminUsers, defaultUsers);

  const [selectedPublicationId, setSelectedPublicationId] = useState<number | null>(null);
  const [publicationDraft, setPublicationDraft] = useState({ title: '', authors: '', description: '', url: '' });

  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [resourceDraft, setResourceDraft] = useState({ title: '', link: '', imageUrl: '' });

  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [guideDraft, setGuideDraft] = useState({ title: '', content: '' });

  const [selectedAboutId, setSelectedAboutId] = useState<string | null>(null);
  const [aboutDraft, setAboutDraft] = useState({ title: '', content: '' });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDraft, setUserDraft] = useState<UserDraft>({
    fullname: '',
    username: '',
    email: '',
    phoneNumber: '',
    role: AppRole.AUTHORIZED,
  });

  const counters = useMemo(
    () => ({
      publications: publications.length,
      resources: resources.length,
      guide: guideRecords.length,
      about: aboutRecords.length,
      users: users.length,
    }),
    [publications.length, resources.length, guideRecords.length, aboutRecords.length, users.length],
  );

  const notifyStub = () =>
    dispatch(
      appActions.showWarning(
        'Методы админ-панели на бэкенде пока не реализованы. Изменения сохранены локально в браузере.',
      ),
    );

  const resetPublication = () => {
    setSelectedPublicationId(null);
    setPublicationDraft({ title: '', authors: '', description: '', url: '' });
  };

  const selectPublication = (id: number) => {
    const target = publications.find((item) => item.id === id);
    if (!target) return;
    setSelectedPublicationId(id);
    setPublicationDraft({
      title: target.title,
      authors: target.authors,
      description: target.description,
      url: target.url,
    });
  };

  const savePublication = () => {
    if (!publicationDraft.title.trim() || !publicationDraft.url.trim()) {
      dispatch(appActions.showError('Для публикации нужно заполнить название и ссылку.'));
      return;
    }

    if (selectedPublicationId === null) {
      const nextId = publications.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      setPublications((prev) => [
        {
          id: nextId,
          title: publicationDraft.title.trim(),
          authors: publicationDraft.authors.trim(),
          description: publicationDraft.description.trim(),
          url: publicationDraft.url.trim(),
        },
        ...prev,
      ]);
      setSelectedPublicationId(nextId);
    } else {
      setPublications((prev) =>
        prev.map((item) =>
          item.id === selectedPublicationId
            ? {
                ...item,
                title: publicationDraft.title.trim(),
                authors: publicationDraft.authors.trim(),
                description: publicationDraft.description.trim(),
                url: publicationDraft.url.trim(),
              }
            : item,
        ),
      );
    }

    notifyStub();
  };

  const removePublication = () => {
    if (selectedPublicationId === null) return;
    setPublications((prev) => prev.filter((item) => item.id !== selectedPublicationId));
    resetPublication();
    notifyStub();
  };

  const resetResource = () => {
    setSelectedResourceId(null);
    setResourceDraft({ title: '', link: '', imageUrl: '' });
  };

  const selectResource = (id: string) => {
    const target = resources.find((item) => item.id === id);
    if (!target) return;
    setSelectedResourceId(id);
    setResourceDraft({ title: target.title, link: target.link, imageUrl: target.imageUrl });
  };

  const saveResource = () => {
    if (!resourceDraft.title.trim() || !resourceDraft.link.trim()) {
      dispatch(appActions.showError('Для ресурса нужно заполнить название и ссылку.'));
      return;
    }

    if (selectedResourceId === null) {
      const nextId = createId();
      setResources((prev) => [
        {
          id: nextId,
          title: resourceDraft.title.trim(),
          link: resourceDraft.link.trim(),
          imageUrl: resourceDraft.imageUrl.trim(),
        },
        ...prev,
      ]);
      setSelectedResourceId(nextId);
    } else {
      setResources((prev) =>
        prev.map((item) =>
          item.id === selectedResourceId
            ? {
                ...item,
                title: resourceDraft.title.trim(),
                link: resourceDraft.link.trim(),
                imageUrl: resourceDraft.imageUrl.trim(),
              }
            : item,
        ),
      );
    }

    notifyStub();
  };

  const removeResource = () => {
    if (selectedResourceId === null) return;
    setResources((prev) => prev.filter((item) => item.id !== selectedResourceId));
    resetResource();
    notifyStub();
  };

  const resetGuide = () => {
    setSelectedGuideId(null);
    setGuideDraft({ title: '', content: '' });
  };

  const selectGuideRecord = (id: string) => {
    const target = guideRecords.find((item) => item.id === id);
    if (!target) return;
    setSelectedGuideId(id);
    setGuideDraft({ title: target.title, content: target.content });
  };

  const saveGuideRecord = () => {
    if (!guideDraft.title.trim() || !guideDraft.content.trim()) {
      dispatch(appActions.showError('Для раздела руководства заполните название и текст.'));
      return;
    }

    if (selectedGuideId === null) {
      const nextId = createId();
      setGuideRecords((prev) => [
        { id: nextId, title: guideDraft.title.trim(), content: guideDraft.content.trim() },
        ...prev,
      ]);
      setSelectedGuideId(nextId);
    } else {
      setGuideRecords((prev) =>
        prev.map((item) =>
          item.id === selectedGuideId
            ? { ...item, title: guideDraft.title.trim(), content: guideDraft.content.trim() }
            : item,
        ),
      );
    }

    notifyStub();
  };

  const removeGuideRecord = () => {
    if (selectedGuideId === null) return;
    setGuideRecords((prev) => prev.filter((item) => item.id !== selectedGuideId));
    resetGuide();
    notifyStub();
  };

  const resetAbout = () => {
    setSelectedAboutId(null);
    setAboutDraft({ title: '', content: '' });
  };

  const selectAboutRecord = (id: string) => {
    const target = aboutRecords.find((item) => item.id === id);
    if (!target) return;
    setSelectedAboutId(id);
    setAboutDraft({ title: target.title, content: target.content });
  };

  const saveAboutRecord = () => {
    if (!aboutDraft.title.trim() || !aboutDraft.content.trim()) {
      dispatch(appActions.showError('Для раздела «О проекте» заполните название и текст.'));
      return;
    }

    if (selectedAboutId === null) {
      const nextId = createId();
      setAboutRecords((prev) => [
        { id: nextId, title: aboutDraft.title.trim(), content: aboutDraft.content.trim() },
        ...prev,
      ]);
      setSelectedAboutId(nextId);
    } else {
      setAboutRecords((prev) =>
        prev.map((item) =>
          item.id === selectedAboutId
            ? { ...item, title: aboutDraft.title.trim(), content: aboutDraft.content.trim() }
            : item,
        ),
      );
    }

    notifyStub();
  };

  const removeAboutRecord = () => {
    if (selectedAboutId === null) return;
    setAboutRecords((prev) => prev.filter((item) => item.id !== selectedAboutId));
    resetAbout();
    notifyStub();
  };

  const resetUser = () => {
    setSelectedUserId(null);
    setUserDraft({ fullname: '', username: '', email: '', phoneNumber: '', role: AppRole.AUTHORIZED });
  };

  const selectUser = (id: string) => {
    const target = users.find((item) => item.id === id);
    if (!target) return;

    setSelectedUserId(id);
    setUserDraft({
      fullname: target.fullname,
      username: target.username,
      email: target.email,
      phoneNumber: target.phoneNumber,
      role: target.role,
    });
  };

  const saveUser = () => {
    if (!userDraft.fullname.trim() || !userDraft.username.trim()) {
      dispatch(appActions.showError('Для пользователя заполните ФИО и логин.'));
      return;
    }

    const normalizedUsername = userDraft.username.trim().toLowerCase();
    const usernameConflict = users.some(
      (user) =>
        user.username.toLowerCase() === normalizedUsername &&
        (selectedUserId === null || user.id !== selectedUserId),
    );

    if (usernameConflict) {
      dispatch(appActions.showError('Пользователь с таким логином уже существует.'));
      return;
    }

    if (selectedUserId === null) {
      const nextId = createId();
      setUsers((prev) => [
        {
          id: nextId,
          fullname: userDraft.fullname.trim(),
          username: userDraft.username.trim(),
          email: userDraft.email.trim(),
          phoneNumber: userDraft.phoneNumber.trim(),
          role: userDraft.role,
          locked: false,
        },
        ...prev,
      ]);
      setSelectedUserId(nextId);
    } else {
      const nextUsers = users.map((user) =>
        user.id === selectedUserId
          ? {
              ...user,
              fullname: userDraft.fullname.trim(),
              username: userDraft.username.trim(),
              email: userDraft.email.trim(),
              phoneNumber: userDraft.phoneNumber.trim(),
              role: userDraft.role,
            }
          : user,
      );

      if (countAdmins(nextUsers) === 0) {
        dispatch(appActions.showError('В системе должен остаться минимум один администратор.'));
        return;
      }

      setUsers(nextUsers);
    }

    notifyStub();
  };

  const removeUser = () => {
    if (selectedUserId === null) return;
    const nextUsers = users.filter((user) => user.id !== selectedUserId);
    if (countAdmins(nextUsers) === 0) {
      dispatch(appActions.showError('Нельзя удалить последнего администратора.'));
      return;
    }

    setUsers(nextUsers);
    resetUser();
    notifyStub();
  };

  const toggleUserLock = (id: string) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, locked: !user.locked } : user)));
    notifyStub();
  };

  const changeUserRole = (id: string, role: string) => {
    const nextUsers = users.map((user) => (user.id === id ? { ...user, role } : user));
    if (countAdmins(nextUsers) === 0) {
      dispatch(appActions.showError('В системе должен остаться минимум один администратор.'));
      return;
    }

    setUsers(nextUsers);
    if (selectedUserId === id) {
      setUserDraft((prev) => ({ ...prev, role }));
    }
    notifyStub();
  };

  return (
    <Box className={styles.page}>
      <Paper className={styles.hero}>
        <div className={styles.heroTop}>
          <Box>
            <Typography variant="h2">Админ-панель</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
              Разделы для редактирования публикаций, внешних ресурсов, руководства, раздела «О проекте»
              и управления пользователями.
            </Typography>
          </Box>
          <Chip label="Режим заглушки" color="warning" variant="outlined" />
        </div>
        <Alert severity="info" className={styles.warning}>
          Сохранение в серверную базу пока не подключено.
        </Alert>
      </Paper>

      <Paper className={styles.panel}>
        <Tabs value={activeTab} onChange={(_, value: AdminTab) => setActiveTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab value="publications" label={`Публикации (${counters.publications})`} />
          <Tab value="resources" label={`Внешние ресурсы (${counters.resources})`} />
          <Tab value="guide" label={`Руководство (${counters.guide})`} />
          <Tab value="about" label={`О проекте (${counters.about})`} />
          <Tab value="users" label={`Пользователи (${counters.users})`} />
        </Tabs>

        <Typography variant="body2" className={styles.hint}>
          Интерфейс готов к интеграции с API. Сейчас все действия сохраняются локально.
        </Typography>

        {activeTab === 'publications' && (
          <div className={styles.section}>
            <div className={styles.split}>
              <div className={styles.listBox}>
                <div className={styles.listHead}>Список публикаций</div>
                <div className={styles.listBody}>
                  {publications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.listItem} ${selectedPublicationId === item.id ? styles.listItemActive : ''}`}
                      onClick={() => selectPublication(item.id)}
                    >
                      <div className={styles.listPrimary}>{item.title}</div>
                      <div className={styles.listSecondary}>{item.authors || 'Без авторов'}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.editorBox}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {selectedPublicationId === null ? 'Новая публикация' : `Редактирование #${selectedPublicationId}`}
                </Typography>
                <TextField label="Название" value={publicationDraft.title} onChange={(event) => setPublicationDraft((prev) => ({ ...prev, title: event.target.value }))} size="small" />
                <TextField label="Авторы" value={publicationDraft.authors} onChange={(event) => setPublicationDraft((prev) => ({ ...prev, authors: event.target.value }))} size="small" />
                <TextField label="Описание" value={publicationDraft.description} onChange={(event) => setPublicationDraft((prev) => ({ ...prev, description: event.target.value }))} size="small" multiline minRows={3} />
                <TextField label="Ссылка" value={publicationDraft.url} onChange={(event) => setPublicationDraft((prev) => ({ ...prev, url: event.target.value }))} size="small" />
                <div className={styles.editorActions}>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<AddIcon />} onClick={resetPublication}>Новая</Button>
                    <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={removePublication} disabled={selectedPublicationId === null}>Удалить</Button>
                  </Stack>
                  <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={savePublication}>Сохранить запись</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className={styles.section}>
            <div className={styles.split}>
              <div className={styles.listBox}>
                <div className={styles.listHead}>Список ресурсов</div>
                <div className={styles.listBody}>
                  {resources.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.listItem} ${selectedResourceId === item.id ? styles.listItemActive : ''}`}
                      onClick={() => selectResource(item.id)}
                    >
                      <div className={styles.listPrimary}>{item.title}</div>
                      <div className={styles.listSecondary}>{item.link}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.editorBox}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {selectedResourceId === null ? 'Новый ресурс' : 'Редактирование ресурса'}
                </Typography>
                <TextField label="Название" value={resourceDraft.title} onChange={(event) => setResourceDraft((prev) => ({ ...prev, title: event.target.value }))} size="small" />
                <TextField label="Ссылка" value={resourceDraft.link} onChange={(event) => setResourceDraft((prev) => ({ ...prev, link: event.target.value }))} size="small" />
                <TextField label="Изображение (URL)" value={resourceDraft.imageUrl} onChange={(event) => setResourceDraft((prev) => ({ ...prev, imageUrl: event.target.value }))} size="small" />
                <div className={styles.editorActions}>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<AddIcon />} onClick={resetResource}>Новый</Button>
                    <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={removeResource} disabled={selectedResourceId === null}>Удалить</Button>
                  </Stack>
                  <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveResource}>Сохранить запись</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={styles.section}>
            <div className={styles.split}>
              <div className={styles.listBox}>
                <div className={styles.listHead}>Разделы руководства</div>
                <div className={styles.listBody}>
                  {guideRecords.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.listItem} ${selectedGuideId === item.id ? styles.listItemActive : ''}`}
                      onClick={() => selectGuideRecord(item.id)}
                    >
                      <div className={styles.listPrimary}>{item.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.editorBox}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {selectedGuideId === null ? 'Новый раздел руководства' : 'Редактирование раздела'}
                </Typography>
                <TextField label="Заголовок" value={guideDraft.title} onChange={(event) => setGuideDraft((prev) => ({ ...prev, title: event.target.value }))} size="small" />
                <TextField label="Текст раздела" value={guideDraft.content} onChange={(event) => setGuideDraft((prev) => ({ ...prev, content: event.target.value }))} size="small" multiline minRows={6} />
                <div className={styles.editorActions}>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<AddIcon />} onClick={resetGuide}>Новый</Button>
                    <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={removeGuideRecord} disabled={selectedGuideId === null}>Удалить</Button>
                  </Stack>
                  <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveGuideRecord}>Сохранить запись</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.section}>
            <div className={styles.split}>
              <div className={styles.listBox}>
                <div className={styles.listHead}>Материалы «О проекте»</div>
                <div className={styles.listBody}>
                  {aboutRecords.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.listItem} ${selectedAboutId === item.id ? styles.listItemActive : ''}`}
                      onClick={() => selectAboutRecord(item.id)}
                    >
                      <div className={styles.listPrimary}>{item.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.editorBox}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {selectedAboutId === null ? 'Новая запись' : 'Редактирование записи'}
                </Typography>
                <TextField label="Заголовок" value={aboutDraft.title} onChange={(event) => setAboutDraft((prev) => ({ ...prev, title: event.target.value }))} size="small" />
                <TextField label="Текст" value={aboutDraft.content} onChange={(event) => setAboutDraft((prev) => ({ ...prev, content: event.target.value }))} size="small" multiline minRows={6} />
                <div className={styles.editorActions}>
                  <Stack direction="row" spacing={1}>
                    <Button startIcon={<AddIcon />} onClick={resetAbout}>Новая</Button>
                    <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={removeAboutRecord} disabled={selectedAboutId === null}>Удалить</Button>
                  </Stack>
                  <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveAboutRecord}>Сохранить запись</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.section}>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>E-mail</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <button
                          type="button"
                          className={`${styles.listItem} ${selectedUserId === user.id ? styles.listItemActive : ''}`}
                          onClick={() => selectUser(user.id)}
                        >
                          <div className={styles.listPrimary}>{user.fullname}</div>
                          <div className={styles.listSecondary}>{user.username}</div>
                        </button>
                      </td>
                      <td>{user.email || '—'}</td>
                      <td>{user.phoneNumber || '—'}</td>
                      <td>
                        <FormControl size="small" fullWidth>
                          <Select value={user.role} onChange={(event) => changeUserRole(user.id, String(event.target.value))}>
                            <MenuItem value={AppRole.ADMIN}>{AppRole.ADMIN}</MenuItem>
                            <MenuItem value={AppRole.AUTHORIZED}>{AppRole.AUTHORIZED}</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                      <td>
                        <Stack direction="row" spacing={1}>
                          <Chip size="small" label={user.locked ? 'Заблокирован' : 'Активен'} color={user.locked ? 'default' : 'success'} variant={user.locked ? 'outlined' : 'filled'} />
                          <Button size="small" onClick={() => toggleUserLock(user.id)}>
                            {user.locked ? 'Разблокировать' : 'Блокировать'}
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.editorBox} style={{ marginTop: 10 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {selectedUserId === null ? 'Новый пользователь' : 'Редактирование пользователя'}
              </Typography>
              <TextField label="ФИО" value={userDraft.fullname} onChange={(event) => setUserDraft((prev) => ({ ...prev, fullname: event.target.value }))} size="small" />
              <TextField label="Логин" value={userDraft.username} onChange={(event) => setUserDraft((prev) => ({ ...prev, username: event.target.value }))} size="small" />
              <TextField label="E-mail" value={userDraft.email} onChange={(event) => setUserDraft((prev) => ({ ...prev, email: event.target.value }))} size="small" />
              <TextField label="Телефон" value={userDraft.phoneNumber} onChange={(event) => setUserDraft((prev) => ({ ...prev, phoneNumber: event.target.value }))} size="small" />
              <FormControl size="small">
                <InputLabel id="admin-user-role-label">Роль</InputLabel>
                <Select labelId="admin-user-role-label" label="Роль" value={userDraft.role} onChange={(event) => setUserDraft((prev) => ({ ...prev, role: String(event.target.value) }))}>
                  <MenuItem value={AppRole.ADMIN}>{AppRole.ADMIN}</MenuItem>
                  <MenuItem value={AppRole.AUTHORIZED}>{AppRole.AUTHORIZED}</MenuItem>
                </Select>
              </FormControl>

              <div className={styles.editorActions}>
                <Stack direction="row" spacing={1}>
                  <Button startIcon={<AddIcon />} onClick={resetUser}>Новый</Button>
                  <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={removeUser} disabled={selectedUserId === null}>Удалить</Button>
                </Stack>
                <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveUser}>Сохранить пользователя</Button>
              </div>
            </div>
          </div>
        )}
      </Paper>
    </Box>
  );
};
