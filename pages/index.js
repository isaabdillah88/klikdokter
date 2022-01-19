import { useState } from "react";
import Link from "next/link";
import Cookie from "js-cookie";
import cookies from 'next-cookies';
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { post } from "../services";

export async function getServerSideProps(context) {
  const token = cookies(context);
  return {
    props: {
      token,
    },
  };
}

export default function Home(props) {
  const { token } = props.token;
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [itemInput, setItemInput] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    const response = await post('item/search', { sku: itemInput.toUpperCase() }, token);
    setProducts([response]);
  }

  async function removeProduct(sku) {
    const confirmation = confirm(`Apakah data ini akan dihapus SKU ${sku} ?`);

    if(confirmation) {
      setLoading(true);
      const response =  await post('item/delete', { sku: sku }, token);
      if(!response.id) {
        let msgAdd = response.error ?? response.message;
        setSuccess(false);
        setMessage(msgAdd);
        setLoading(false);
      } else {
        setSuccess(true);
        setMessage('Delete Product Successful');
        setProducts([]);
        setItemInput('');
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    }
  }

  function logoutPage(e) {
    e.preventDefault();
    setLoading(true);
    Cookie.remove('token');
    setSuccess(true);
    setMessage('Logout Successful');
    setTimeout(() => {
      setMessage('');
      setLoading(false);
      router.push('/auth/login');
    }, 3000);
  }

  return (
    <div className={styles.container}>
      <div className="row justify-content-md-center">
        <div className="col col-sm-6">
          {message && success &&
              <div className="alert alert-success" role="alert">{message}</div>
          }
          {message && !success &&
              <div className="alert alert-danger" role="alert">{message}</div>
          }
        </div>
      </div>
      <div className="text-end">
        {!token &&
          <>
            <button type="submit" className="btn btn-outline-primary mb-3" onClick={() => router.push('/auth/register')}>Register</button>
            <button type="button" className="btn btn-primary mb-3 ms-3" onClick={() => router.push('/auth/login')}>Login</button>
          </>
        }
        {token &&
          <button type="submit" className="btn btn-outline-primary mb-3" onClick={logoutPage} disabled={loading}>Logout</button>
        }
      </div>
      <form className="row g-3 mt-2" onSubmit={handleSearch}>
        <div className="col-auto">
          <input type="text" className="form-control" placeholder="Input SKU" onChange={(event) => setItemInput(event.target.value)} value={itemInput} disabled={!token} />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3" disabled={!token || loading}>Search</button>
          <button type="button" className="btn btn-primary mb-3 ms-3" onClick={() => router.push('/product/add')} disabled={!token || loading}>Add Prouct</button>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products[0]?.id &&
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.product_name}</td>
                <td>
                  <Link
                    href={`/product/edit/${product.sku}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger btn-delete-user ms-2"
                    onClick={() => removeProduct(product.sku)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {(products[0]?.sku || products[0]?.message) && !products[0]?.id && (
            <tr>
              <td colSpan="3" className="text-center text-danger">
                {products[0]?.sku ?? products[0]?.message}
              </td>
            </tr>
          )}
          {products && !products.length && (
            <tr>
              <td colSpan="3" className="text-center text-danger">
                {token ? 'Please Input SKU to Display Product List' : 'Please Login to Access CRUD'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
