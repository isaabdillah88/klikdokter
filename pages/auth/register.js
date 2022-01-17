import { useState, useEffect } from "react";
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

export default function Register(props) {
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

    async function handleRegister(e) {
        e.preventDefault();
        const values = [email, password];
        const allFieldsFill = values.every((field) => {
            const value = `${field}`.trim();
            return value !== '' && value !== '0';
        });

        if(allFieldsFill) {
            setLoading(true);
            const registerEmail = await fetch('https://hoodwink.medkomtek.net/api/register', {
                method: 'POST',
                body: JSON.stringify(fields),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const response = await registerEmail.json();
            if(!response.success) {
                setSuccess(false);
                setMessage(response.email[0]);
                setLoading(false);
            } else {
                setSuccess(true);
                setMessage(response.message);
                setTimeout(() => {
                    setLoading(false);
                    router.push('/auth/login');
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
                            <h4 className="card-header">Register</h4>
                            <div className="card-body">
                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input id="email" name="email" type="text" className="form-control" autoComplete="off" onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input id="password" name="password" type="password" className="form-control" autoComplete="off" onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3 text-end">
                                        <button type="button" className="btn btn-outline-primary mt-3" onClick={() => router.push('/auth/login')} disabled={loading}>Login</button>
                                        <button type="submit" className="btn btn-primary mt-3 ms-3" disabled={loading}>Save</button>
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
