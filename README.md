# Restaurant Ordering app
Online ordering app for Big Donut store.

My scrimba solo project in module 5.
I build it from scratch and use all the tricks and great practice. This is so far my biggest project, and I put many efforts into it.

## feature
- [x] Main menu rendered by categories from database.
- [x] In main, user can add menu items into the cart and get the total price and items count. User can also clear the cart.
- [x] In cart modal, user can add/remove/clear items, can checkout (warm if empty cart or include not for sale item).
- [x] In checkout modal, there is compulsory and simple validation form for payment card information. Also discount feature, apply immediately by inputing.
- [x] In order confirmation modal, show the order summary and has rating feature.
- [x] Footer tabs show simple informations in modal.
- [x] Store current cart in localStorage.
### 2.0
- [] discount code tab, copy to clipboard button
- [] order history tab, show data in localStorage
- [] Firebase Database

## bugs
- [x] event target with icon can't work properly. Solved by removing pointer events inside clickable elements to preventing icons from becoming the event.target
- [x] reset form event cannot trigger applyDiscount function listening to the discountCode input event, bc the input event is not fired when JavaScript changes an element's value programmatically. Solved by adding a listener to form reset event, also defer the function to make sure value is reset.

## for testing efficiency
- [x] Enabling HTTPS for Live Server on VSCod (certificates made with mkcert), to make autofill works on local service on Chrome