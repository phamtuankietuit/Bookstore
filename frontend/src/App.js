import { Fragment, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/components/layouts';
import { getLocalStorage, isLogin } from '~/store/getLocalStorage';
import Page403 from './pages/ExceptionPages/403';

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin() === 'false') {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                const Page = route.component;

                let Layout = DefaultLayout;

                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = Fragment;
                }

                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            Layout === DefaultLayout ? (
                                <Layout
                                    title={route.title}
                                    back={route.back}
                                >
                                    <Page />
                                </Layout>
                            ) : (
                                <Layout>
                                    <Page />
                                </Layout>
                            )
                        }
                    />
                );
            })}
            {privateRoutes.map((route, index) => {
                let Page = route.component;

                let Layout = DefaultLayout;

                if (route.layout) {
                    Layout = route.layout;
                } else if (route.layout === null) {
                    Layout = Fragment;
                }

                if (isLogin() === 'true') {

                    if (getLocalStorage() !== null) {
                        const role = getLocalStorage().user.role;

                        if (role === 'admin') {
                            return <Route
                                key={index}
                                path={route.path}
                                element={
                                    Layout === DefaultLayout ? (
                                        <Layout
                                            title={route.title}
                                            back={route.back}
                                        >
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />;
                        } else if (route.role?.includes(role)) {
                            return <Route
                                key={index}
                                path={route.path}
                                element={
                                    Layout === DefaultLayout ? (
                                        <Layout
                                            title={route.title}
                                            back={route.back}
                                        >
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    )
                                }
                            />;
                        } else {
                            return <Route
                                key={index}
                                path={route.path}
                                element={<Page403 />}
                            />;
                        }
                    }
                }
                return null;
            })}
        </Routes>
    );
}

export default App;
