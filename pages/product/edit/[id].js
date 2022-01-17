import { AddEdit } from "../../../components/AddEdit";
import cookies from 'next-cookies';

export async function getServerSideProps(context) {
    const token = cookies(context);
    const productBySKU = await fetch('https://hoodwink.medkomtek.net/api/item/search', {
        method: 'POST',
        body: JSON.stringify({ sku: context.params.id }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(data => data.json());
    return {
        props: {
            token: token,
            product: productBySKU
        }
    }
}

export default AddEdit;
