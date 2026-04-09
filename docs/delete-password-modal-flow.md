# Delete Password Modal Flow

This document explains how the delete password flow works in `passify`, including how the delete modal communicates with the parent page and how props/callbacks are passed.

## 1. What `DeletePasswordModal` does

`src/components/modals/DeletePasswordModal.jsx` is a simple confirmation modal with:
- a Cancel button
- a Delete button
- a callback-based delete action

The modal itself does not decide the toast UI or the parent modal state. Instead, it uses callbacks passed in from the parent to relay success or error results.

## 2. Props passed into `DeletePasswordModal`

The component accepts these props:

- `handleDeleteModalClose`
  - A function that closes the delete confirmation modal.
  - This is called when the user cancels or after the delete attempt finishes.

- `onHandleDeletePasswordSuccess`
  - A callback for when delete succeeds.
  - It receives a message string as an argument.
  - The parent page uses this to show a success toaster and perform any additional cleanup.

- `onHandleDeletePasswordError`
  - A callback for when delete fails.
  - It receives a message string as an argument.
  - The parent page uses this to show an error toaster.

## 3. How `handleDeletePassword` works

Inside `DeletePasswordModal`, we added a local action named `handleDeletePassword`:

```js
const handleDeletePassword = async () => {
  setIsLoading(true);
  setError(false);

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isSuccess = true;

    if (isSuccess) {
      handleDeleteModalClose();
      onHandleDeletePasswordSuccess("Password deleted successfully!");
    } else {
      throw new Error("Failed to delete password. Please try again.");
    }
  } catch (err) {
    setError(true);
    handleDeleteModalClose();
    onHandleDeletePasswordError(
      err.message || "Something went wrong. Please try again.",
    );
  } finally {
    setIsLoading(false);
  }
};
```

### Step-by-step breakdown:

1. `setIsLoading(true)` starts a loading state so the Delete button is disabled and shows `Deleting...`.
2. The code simulates an async delete call:
   - In production, this is where your Supabase or backend delete logic should go.
3. If the delete succeeds:
   - `handleDeleteModalClose()` closes the delete modal.
   - `onHandleDeletePasswordSuccess(...)` sends a message back to the parent.
4. If the delete fails:
   - `setError(true)` records an error state locally.
   - `handleDeleteModalClose()` still closes the modal.
   - `onHandleDeletePasswordError(...)` sends the error message back to the parent.
5. `finally` resets loading state.

## 4. Why this pattern is used

This is a common React pattern for child-to-parent communication:

- The parent owns the state for the modal and toaster.
- The child performs the action and reports the result.
- The child uses function props as "relay batons".

That means the child only needs to know:
- what action to execute
- how to tell the parent whether it succeeded or failed

It does not need to know:
- how the parent shows toasters
- how the parent closes the outer modal
- how the parent updates the main password list

## 5. How the parent receives the callbacks

In `src/app/password-vault/page.jsx`, the success and error callbacks are defined in the page itself:

```js
const displayToaster = (type, message) => {
  setToasterData({ type, message });
  setShowToaster(true);
  setTimeout(() => setShowToaster(false), 5000);
};
```

Then the page passes functions into the `ViewPasswordModal`:

```jsx
<ViewPasswordModal
  passwordData={selectedPassword}
  handleViewPasswordCloseModal={handleViewPasswordCloseModal}
  onUpdatePasswordSuccess={(msg) => displayToaster("success", msg)}
  onUpdatePasswordError={(msg) => displayToaster("error", msg)}
  onHandleDeletePasswordSuccess={(msg) => {
    displayToaster("success", msg);
    handleViewPasswordCloseModal();
  }}
  onHandleDeletePasswordError={(msg) => displayToaster("error", msg)}
/>
```

Then `ViewPasswordModal` passes those callbacks down into `DeletePasswordModal` directly.

## 6. The full prop chain

The prop chain looks like this:

- `PasswordVaultPage` renders `ViewPasswordModal`
- `ViewPasswordModal` renders `DeletePasswordModal`
- `DeletePasswordModal` calls:
  - `handleDeleteModalClose()`
  - `onHandleDeletePasswordSuccess(...)`
  - `onHandleDeletePasswordError(...)`

This means the message travels from the Delete button all the way back up to the page.

## 7. Matching the add-password flow

The add password flow uses the same approach:

- `PasswordVaultPage` renders `AddPasswordModal`
- `AddPasswordModal` renders `AddPasswordForm`
- `AddPasswordForm` performs the add action and then calls:
  - `onAddPasswordSuccess(...)`
  - `onAddPasswordError(...)`

That is the same child-to-parent callback pattern we now use for delete.

## 8. Summary

- `DeletePasswordModal` handles the UI and the delete action.
- It does not show toasters directly.
- It reports results with callbacks.
- The parent page owns the toaster state and shows messages after the modal closes.

This keeps the modal reusable and the page responsible for the overall app state.
