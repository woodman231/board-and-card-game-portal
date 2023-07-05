import React from 'react';
import MainMenu from './mainMenu';
import ApplicationTitle from './applicationTitle';
import type { PropsWithChildren } from 'react';

interface DefaultLayoutProps extends PropsWithChildren {
    pageTitle: string;
    pageDescription: string;
}

function DefaultLayout(props: DefaultLayoutProps) {

    React.useEffect(() => {
        document.title = props.pageTitle;
        document.querySelector('meta[name="description"]')?.setAttribute('content', props.pageDescription);
    }, [props.pageTitle, props.pageDescription]);

    return (
        <div className='grid grid-cols-1 justify-items-stretch items-stretch min-h-screen bg-stone-900 text-white w-screen md:py-2'>
            <div className='bg-stone-400 h-12 lg:mx-96 md:mx-48'>
                <div className='w-full flex justify-start gap-2 align-text-top bg-stone-700 md:border md:border-white'>
                    <div className="p-2">
                        <MainMenu />
                    </div>
                    <div className="self-center">
                        <ApplicationTitle />
                    </div>
                </div>
            </div>
            <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-7.5rem)] p-2 lg:mx-96 md:mx-48 md:border-x md:border-white overflow-auto'>
                <h1 className="text-2xl font-bold p-t-2">{props.pageTitle}</h1>
                {props.children}
            </div>
            <div className='bg-stone-600 h-12 p-2 lg:mx-96 md:mx-48 md:border md:border-white'>
                <p>Created By Sean Woodward</p>
            </div>
        </div>
    );
}

export default DefaultLayout;