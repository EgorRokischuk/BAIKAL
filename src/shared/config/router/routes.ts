const ROUTES = {
    appRoute: '/',
    auth: {
        route: 'auth',
        login: {
            route: 'login',
            page: '/auth/login'
        },
        register: {
            route: 'register',
            page: '/auth/register'
        }
    },
    about: {
        route: 'about',
        page: '/about'
    },
    publications: {
        route: 'publications',
        page: '/publications'
    },
    externalResources: {
        route: 'externalResources',
        page: '/externalResources'
    },
    guide: {
        route: 'guide',
        page: '/guide'
    },
    support: {
        route: 'support',
        page: '/support'
    },
    exceptions: {
        accessDenied: {
            route: '401',
            page: '/401'
        },
        notFound: {
            route: '404',
            page: '/404'
        }
    }
}

export { ROUTES }