import { Item } from "../Item/Item";

export const ItemList = ({ list }) => {
    return (
        <>
            {list.length ? (
                list.map((subasta) => <Item key={subasta.id} {...subasta} />)
            ) : (
                <p className="no-results">No hay subastas disponibles.</p>
            )}
        </>
    );
};