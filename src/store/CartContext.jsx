import { createContext, useReducer } from 'react';

// placeholder functions for addItem, removeItem, and clearCart
const CartContext = createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {},
});

// a reducer function to manage state changes based on different actions.
function cartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        // check if the item already exists in the cart
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        // a copy of the current items array
        const updatedItems = [...state.items];

        if (existingCartItemIndex > -1) {
            // if the item exists, update its quantity
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            // if the item doesn't exist, add it with quantity 1
            updatedItems.push({ ...action.item, quantity: 1 });
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === 'REMOVE_ITEM') {
        // finds the existing item
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id
        );
        const existingCartItem = state.items[existingCartItemIndex];

        const updatedItems = [...state.items];

        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === 'CLEAR_CART') {
        return { ...state, items: [] };
    }

    return state;
}

// CartContextProvider component to manage the cart state and provide context to the components
export function CartContextProvider({ children }) {
    // useReducer hook will manage the state in the cartContext
    // the initial state is an empty array of items
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction({ type: 'ADD_ITEM', item });
    }

    function removeItem(id) {
        dispatchCartAction({ type: 'REMOVE_ITEM', id });
    }

    function clearCart() {
        dispatchCartAction({ type: 'CLEAR_CART' });
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
        clearCart
    };

    // providing the cartContext value to the components in its children
    // the context is now available to this component's children
    return (
        <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
    );
}

export default CartContext;