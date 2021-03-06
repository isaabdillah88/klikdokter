import { useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { post } from "../../services";

export default function Login() {
    const router = useRouter();
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
            return value !== '';
        });

        if(allFieldsFill) {
            setLoading(true);
            const response = await post('auth/login', fields);
            if(!response.token) {
                let msgLogin = response.error ?? response.email[0];
                setSuccess(false);
                setMessage(msgLogin);
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
