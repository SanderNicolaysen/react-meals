import { useContext, useState } from "react";
import CartContext from '../../store/cart-context';

import classes from './Cart.module.css';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import Checkout from './Checkout';
import Spinner from '../UI/Spinner';

const Cart = props => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    }

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({...item, amount: 1});
    }

    const orderHandler = () => {
        setIsCheckout(true);
    }

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        const response = await fetch('https://react-meals-a7f84-default-rtdb.europe-west1.firebasedatabase.app/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderItems: cartCtx.items
            })
        });
        setIsSubmitting(false);
        setDidSubmit(true);

        cartCtx.clearCart();
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

    const actionButtons = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onCloseCart}>Close</button>
            {hasItems && <button onClick={orderHandler} className={classes.button}>Order</button>}
        </div>
    );

    const cartModalContent = (
        <>
            {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCloseCart={props.onCloseCart} />}
            {!isCheckout && actionButtons}
        </>
    );

    const isSubmittingModalContent = (
        <Spinner />
    );

    const didSubmitModalContent = (
        <>
            <p>Successfully sent the order!</p>
            <div className={classes.actions}>
                <button className={classes['button--alt']} onClick={props.onCloseCart}>Close</button>
            </div>
        </>
    );

    return (
        <Modal onClose={props.onCloseCart}>
           {!isSubmitting && !didSubmit && cartModalContent}
           {isSubmitting && isSubmittingModalContent}
           {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
}

export default Cart;