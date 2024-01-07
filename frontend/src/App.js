import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, redirect } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from '~/components/layouts';
import { isLogin } from '~/store/getLocalStorage';

function App() {
    return (
        <Router>
            <div>
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
