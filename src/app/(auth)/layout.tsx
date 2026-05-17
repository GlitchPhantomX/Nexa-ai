interface Props {
    children: React.ReactNode
};

const Layout = ({children}: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-4xl">
                {children}
            </div>
        </div>
    )
}

export default Layout;