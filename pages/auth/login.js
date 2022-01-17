import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import cookies from 'next-cookies';

export async function getServerSideProps(context) {
    const token = cookies(context);
    return { 
        props: {
            token
        } 
    }
}

export default function Login(props) {
    const router = useRouter();

    useEffect(() => {
        if(Object.keys(props.token).length !== 0) {
            router.push('/');
        }
    });
    
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });
    const { email, password } = fields;

    async function handleLogin(e) {
        e.preventDefault();
        const values = [email, password];
        const allFieldsFill = values.every((field) => {
            const value = `${field}`.trim();
            return value !== '' && value !== '0';
        });

        if(allFieldsFill) {
            setLoading(true);
            const userLogin = await fetch('https://hoodwink.medkomtek.net/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(fields),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const response = await userLogin.json();
            if(!response.token) {
                setSuccess(false);
                setMessage(response.error);
                setLoading(false);
            } else {
                setSuccess(true);
                setMessage('Login Successful');
                Cookie.set('token', response.token);
                setTimeout(() => {
                    setLoading(false);
                    router.push('/');
                }, 3000);
            }
        } else {
            setMessage('Please fill out all the fields.');
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setMessage('');
        setFields({
            ...fields,
            [name]: value
        });
    }

    return (
        <div>
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col col-sm-6">
                        {message && success &&
                            <div className="alert alert-success" role="alert">{message}</div>
                        }
                        {message && !success &&
                            <div className="alert alert-danger" role="alert">{message}</div>
                        }
                        <div className="card">
                            <h4 className="card-header">Login</h4>
                            <div className="card-body">
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input id="email" name="email" type="text" className="form-control" autoComplete="off" onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input id="password" name="password" type="password" className="form-control" autoComplete="off" onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3 text-end">
                                        <button type="button" className="btn btn-outline-primary mt-3" onClick={() => router.push('/auth/register')} disabled={loading}>Register</button>
                                        <button type="submit" className="btn btn-primary mt-3 ms-3" disabled={loading}>Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
