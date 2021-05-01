import { useReducer } from 'react';

import CartContext from './cart-context';

const ACTIONS = {
    ADD: 'add',
    REMOVE: 'remove',
    CLEAR: 'clear'
}

const defaultCartState = {
    items: [],
    totalAmount: 0
};

const cartReducer = (state, action) => {
    if (action.type === ACTIONS.ADD) {
        const updatedTotalAmount = state.totalAmount + action.payload.item.price * action.payload.item.amount;
        
        const existingCartItemIndex = state.items.findIndex(
            item => item.id === action.payload.item.id
        );

        const existingCartItem = state.items[existingCartItemIndex];

        let updatedItems;
        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem.amount + action.payload.item.amount
            };
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        else {
            updatedItems = state.items.concat(action.payload.item);
        }
        
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }
    else if (action.type === ACTIONS.REMOVE) {
        const existingCartItemIndex = state.items.findIndex(
            item => item.id === action.payload.id
        );
        const existingCartItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingCartItem.price;
        let updatedItems; 
        if (existingCartItem.amount === 1) {
            updatedItems = state.items.filter(item => item.id !== action.payload.id);
        }
        else {
            const updatedItem = {...existingCartItem, amount: existingCartItem.amount - 1};
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }
    }

    if (action.type === ACTIONS.CLEAR) {
        return defaultCartState;
    }

    return defaultCartState;
};

const CartProvider = props => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = (item) => {
        dispatchCartAction({type: ACTIONS.ADD, payload: {item: item}});
    }

    const removeItemFromCartHandler = (id) => {
        dispatchCartAction({type: ACTIONS.REMOVE, payload: {id: id}});
    }

    const clearCartHandler = () => {
        dispatchCartAction({type: ACTIONS.CLEAR});
    }

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemFromCartHandler,
        clearCart: clearCartHandler
    }

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartProvider;