import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export function AddEdit(props) {
    const router = useRouter();

    useEffect(() => {
        if(Object.keys(props.token).length === 0) {
            router.push('/auth/login');
        }
    })

    const { token } = props.token;
    const product = props?.product;
    const isAddMode = !product;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fields, setFields] = useState({
        sku: props.product ? props.product.sku : '',
        product_name: props.product ? props.product.product_name : '',
        qty: props.product ? props.product.qty : '',
        price: props.product ? props.product.price : '',
        unit: props.product ? props.product.unit : '',
        status: props.product ? props.product.status : ''
    });
    const { sku, product_name, qty, price, unit, status } = fields;

    function handleAddEdit(e) {
        e.preventDefault();
        const values = [sku, product_name, qty, price, unit, status];
        const allFieldsFill = values.every((field) => {
            const value = `${field}`.trim();
            return value !== '';
        });

        if(allFieldsFill) {
            return isAddMode ? createProduct(fields) : editProduct(fields);
        } else {
            setMessage('Please fill out all the fields.');
        }
    }

    async function createProduct(data) {
        setLoading(true);
        const addProduct = await fetch('https://hoodwink.medkomtek.net/api/item/add', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const response = await addProduct.json();
        if(!response.id) {
            let msgAdd = response.error ?? response.message;
            setSuccess(false);
            setMessage(msgAdd);
            setLoading(false);
        } else {
            setSuccess(true);
            setMessage('Add Product Successful');
            setTimeout(() => {
                setLoading(false);
                router.push('/');
            }, 3000);
        }
    }

    async function editProduct(data) {
        setLoading(true);
        const updateProduct = await fetch('https://hoodwink.medkomtek.net/api/item/update', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const response = await updateProduct.json();
        if(!response.id) {
            let msgEdit = response.error ?? response.message;
            setSuccess(false);
            setMessage(msgEdit);
            setLoading(false);
        } else {
            setSuccess(true);
            setMessage('Update Successful');
            setTimeout(() => {
                setLoading(false);
                router.push('/');
            }, 3000);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        switch(name) {
            case 'price':
                if(value !== '' && value.match(/^\d{1,}(\.\d{0,2})?$/)) {
                    setFields({
                        ...fields,
                        [name]: value
                    });
                }
            break;
            case 'qty':
                if(value !== '' && parseInt(value) === +value) {
                    setFields({
                        ...fields,
                        [name]: value
                    });
                }
            break;
            default:
                setFields({
                    ...fields,
                    [name]: value
                });
        }
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
                            <h4 className="card-header">{isAddMode ? 'Add Product' : 'Edit Product'}</h4>
                            <div className="card-body">
                                <form onSubmit={handleAddEdit}>
                                    <div className="mb-3">
                                        <label htmlFor="sku" className="form-label">SKU</label>
                                        <input id="sku" name="sku" type="text" className="form-control" autoComplete="off" value={sku} onChange={handleInputChange} readOnly={!isAddMode} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="product_name" className="form-label">Product Name</label>
                                        <input id="product_name" name="product_name" type="text" className="form-control" autoComplete="off" value={product_name} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="qty" className="form-label">Qty</label>
                                        <input id="qty" name="qty" type="text" className="form-control" autoComplete="off" value={qty} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <input id="price" name="price" type="text" className="form-control" autoComplete="off" value={price} onChange={handleInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="unit" className="form-label">Unit</label>
                                        <select id="unit" name="unit" className="form-control" value={unit} onChange={handleInputChange}>
                                            <option value="">-- Please Select Unit --</option>
                                            <option value="Pcs">Pcs</option>
                                            <option value="Sachet">Sachet</option>
                                            <option value="Carton">Carton</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select id="status" name="status" className="form-control" value={status} onChange={handleInputChange}>
                                            <option value="">-- Please Select Status --</option>
                                            <option value="0">Inactive</option>
                                            <option value="1">Active</option>
                                        </select>
                                    </div>
                                    <div className="mb-3 text-end">
                                        <button type="button" className="btn btn-outline-primary mt-3" onClick={() => router.push('/')} disabled={loading}>Cancel</button>
                                        <button type="submit" className="btn btn-primary mt-3 ms-3" disabled={loading}>Submit</button>
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
