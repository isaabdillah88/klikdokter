import { AddEdit } from "../../components/AddEdit";
import cookies from 'next-cookies';

export async function getServerSideProps(context) {
    const token = cookies(context);
    return {
        props: {
            token
        }
    }
}

export default AddEdit;
