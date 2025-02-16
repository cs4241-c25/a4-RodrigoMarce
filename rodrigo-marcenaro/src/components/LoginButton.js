import React from 'react';

function LoginButton() {
    const handleLogin = () => {
        window.location.href = '/auth/github';
    };

    return (
        <div className="content-center">
        <button onClick={handleLogin} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 border-white">
            Log in through GitHub
        </button>
        </div>
    );
}

export default LoginButton;