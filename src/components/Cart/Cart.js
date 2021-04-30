import { useContext } from "react";
import CartContext from '../../store/cart-context';

import classes from './Cart.module.css';
import Modal from '../UI/Modal';
import CartItem from './CartItem';

const Cart = props => {
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    }

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({...item, amount: 1});
    }

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map((item) => {
                return <CartItem 
                            key={item.id}
                            name={item.name}
                            price={item.price}
                            amount={item.amount}
                            onRemove={() => cartItemRemoveHandler(item.id)}
                            onAdd={() => cartItemAddHandler(item)}/>
            })}
        </ul>
    );

    return (
        <Modal onClose={props.onCloseCart}>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            <div className={classes.actions}>
                <button className={classes['button--alt']} onClick={props.onCloseCart}>Close</button>
                {hasItems && <button className={classes.button}>Order</button>}
            </div>
        </Modal>
    );
}

export default Cart;