/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
) {
  // Query the current user, see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // query current user cart
  const allCartItens = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveField: 'id, quantity',
  });
  const [existingCartItem] = allCartItens;
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, increment by 1!`
    );
    // see if current item is in the cart: if it is increment, if NOT create it
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  return await context.lists.CartItem.createOne({
    data: {
      product: {
        connect: { id: productId },
      },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
