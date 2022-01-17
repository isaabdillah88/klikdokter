import { AddEdit } from "../../../components/AddEdit";
import cookies from 'next-cookies';
import { post } from "../../../services";

export async function getServerSideProps(context) {
    const token = cookies(context);
    const response = await post('item/search', { sku: context.params.id }, token);
    return {
        props: {
            token: token,
            product: response
        }
    }
}

export default AddEdit;
