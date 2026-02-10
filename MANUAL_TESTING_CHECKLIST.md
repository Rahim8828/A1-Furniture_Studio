# Manual Testing Checklist - Core User Flows

This document provides a checklist for manually testing the core user flows of the A1 Furniture Studio e-commerce website.

## Test Environment Setup

1. Start the development server: `npm run dev`
2. Open the application in a browser
3. Clear browser localStorage before each test flow to ensure clean state

## Flow 1: Browse → Add to Cart → Checkout → Order Confirmation

### Steps:
1. **Browse Products**
   - [ ] Homepage loads successfully
   - [ ] Hero section displays "Designs for Every Space"
   - [ ] Featured products grid is visible with product cards
   - [ ] Each product card shows: image, name, price, "Add to Cart" button, wishlist button

2. **Add to Cart**
   - [ ] Click on a product card
   - [ ] Product detail page loads with full information
   - [ ] Click "Add to Cart" button
   - [ ] Cart icon in navigation updates to show count "1"
   - [ ] Success feedback is visible

3. **View Cart**
   - [ ] Click cart icon in navigation
   - [ ] Cart page displays the added product
   - [ ] Product shows: image, name, price, quantity controls
   - [ ] Cart total is calculated correctly
   - [ ] "Proceed to Checkout" button is visible

4. **Checkout**
   - [ ] Click "Proceed to Checkout"
   - [ ] Checkout page loads with order summary
   - [ ] Fill in delivery address fields (name, address, city, state, pincode, phone)
   - [ ] Fill in email address
   - [ ] Select payment method (COD or Online Payment)
   - [ ] Click "Place Order"

5. **Order Confirmation**
   - [ ] Order confirmation page displays
   - [ ] Order ID is shown
   - [ ] Order details are displayed
   - [ ] Cart is now empty (check cart icon shows "0")

**Expected Result:** Complete purchase flow works end-to-end without errors.

---

## Flow 2: Buy Now

### Steps:
1. **Add Product to Cart First**
   - [ ] Navigate to homepage
   - [ ] Click on a product
   - [ ] Click "Add to Cart"
   - [ ] Verify cart count is "1"

2. **Buy Now Different Product**
   - [ ] Navigate back to homepage
   - [ ] Click on a DIFFERENT product
   - [ ] Click "Buy Now" button
   - [ ] Checkout page loads immediately

3. **Verify Cart Isolation**
   - [ ] Checkout page shows only the "Buy Now" product
   - [ ] Original cart item is NOT in checkout
   - [ ] Fill in checkout form and place order
   - [ ] After order confirmation, check cart icon
   - [ ] Cart should still show "1" (original item preserved)

**Expected Result:** Buy Now creates separate checkout without affecting existing cart.

---

## Flow 3: Wishlist

### Steps:
1. **Add to Wishlist**
   - [ ] Navigate to homepage
   - [ ] Click wishlist button (heart icon) on a product card
   - [ ] Wishlist icon in navigation updates to show count "1"
   - [ ] Heart icon on product card changes appearance (filled/colored)

2. **View Wishlist**
   - [ ] Click wishlist icon in navigation
   - [ ] Wishlist page displays the saved product
   - [ ] Product card shows all details
   - [ ] "Move to Cart" button is visible
   - [ ] Remove button is visible

3. **Move to Cart**
   - [ ] Click "Move to Cart" button
   - [ ] Product is added to cart
   - [ ] Cart icon updates to show count "1"
   - [ ] Product is removed from wishlist
   - [ ] Wishlist count updates to "0"

4. **Toggle Wishlist (Idempotence Test)**
   - [ ] Navigate to homepage
   - [ ] Click wishlist button on a product (adds to wishlist)
   - [ ] Wishlist count shows "1"
   - [ ] Click wishlist button again on same product (removes from wishlist)
   - [ ] Wishlist count returns to "0"

**Expected Result:** Wishlist functionality works correctly with toggle behavior.

---

## Flow 4: Cart Management

### Steps:
1. **Add Product to Cart**
   - [ ] Navigate to homepage
   - [ ] Click on a product
   - [ ] Click "Add to Cart"
   - [ ] Navigate to cart page

2. **Update Quantity**
   - [ ] Click "+" button to increase quantity
   - [ ] Quantity updates to "2"
   - [ ] Item total updates (price × 2)
   - [ ] Cart total updates correctly
   - [ ] Click "-" button to decrease quantity
   - [ ] Quantity returns to "1"
   - [ ] Totals update correctly

3. **Remove Item**
   - [ ] Click "Remove" button
   - [ ] Product is removed from cart
   - [ ] "Your cart is empty" message displays
   - [ ] Cart icon shows "0"

4. **Duplicate Item Handling**
   - [ ] Add a product to cart
   - [ ] Navigate back and add the SAME product again
   - [ ] Cart should show quantity "2" for that product
   - [ ] Should NOT create duplicate entries

**Expected Result:** Cart quantity updates and removal work correctly.

---

## Flow 5: Search and Category Browsing

### Steps:
1. **Search Products**
   - [ ] Navigate to homepage
   - [ ] Type "sofa" in search bar
   - [ ] Click search button or press Enter
   - [ ] Search results page loads
   - [ ] Results show products matching "sofa"
   - [ ] Search query is displayed
   - [ ] Result count is shown

2. **Empty Search Results**
   - [ ] Search for "xyz123nonexistent"
   - [ ] "No results found" message displays
   - [ ] Suggestions or alternative products shown

3. **Browse by Category**
   - [ ] Navigate to homepage
   - [ ] Click on "Sofa Sets" category
   - [ ] Category page loads
   - [ ] Page heading shows "Sofa Sets"
   - [ ] Only sofa products are displayed
   - [ ] Product cards show all required information

4. **Category Navigation**
   - [ ] Click on different category from navigation menu
   - [ ] Correct category page loads
   - [ ] Products match the selected category

**Expected Result:** Search and category filtering work correctly.

---

## Additional Verification

### Navigation
- [ ] Logo click returns to homepage
- [ ] All navigation menu items work
- [ ] Mobile responsive menu works (test on mobile viewport)

### Responsive Design
- [ ] Test on desktop viewport (1920x1080)
- [ ] Test on tablet viewport (768x1024)
- [ ] Test on mobile viewport (375x667)
- [ ] All elements are properly sized and accessible

### Error Handling
- [ ] Try to checkout with empty cart (should prevent)
- [ ] Try to submit checkout with missing required fields (should show validation errors)
- [ ] Test with network disconnected (should show appropriate errors)

---

## Test Results Summary

**Date Tested:** _________________

**Tester:** _________________

**Browser:** _________________

**Test Results:**
- Flow 1 (Browse → Cart → Checkout): ☐ Pass ☐ Fail
- Flow 2 (Buy Now): ☐ Pass ☐ Fail
- Flow 3 (Wishlist): ☐ Pass ☐ Fail
- Flow 4 (Cart Management): ☐ Pass ☐ Fail
- Flow 5 (Search & Category): ☐ Pass ☐ Fail

**Issues Found:**
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________

**Notes:**
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________
