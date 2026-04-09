# Profile Edit Mode Flow

This document explains how the `ProfilePage` edit flow works in Passify.
It shows how the button toggles between view/edit states, how data is updated, and how the logic is structured.

## 1. Goal

When the user clicks the `Edit profile` button:
- fields switch from display-only to editable input fields
- the button label changes to `Cancel edit`
- an `Update` button appears under the fields
- clicking `Update` saves the changes and returns to view mode

If `Cancel edit` is clicked while editing:
- the form returns to the original profile values
- edit mode closes without saving

## 2. Component structure

There are two main files involved:

- `src/app/profile/page.jsx`
- `src/components/buttons/EditProfileButton.jsx`

### `EditProfileButton`

This button component is now a reusable button that accepts:
- `onClick` — the function to call when the button is pressed
- `label` — the text that appears on the button

That means the parent page decides both the button action and the button label.

## 3. Profile page state

`ProfilePage` manages several pieces of state:

- `isEditing` — whether the page is currently editing the profile
- `profileData` — the saved profile values shown in view mode
- `formData` — the values typed by the user while editing
- `isLoading` — whether the update action is in progress
- `error` — whether the last update failed

The logic uses two state objects so editing can be canceled cleanly:
- `profileData` holds the official stored values
- `formData` holds temporary changes while the user types

## 4. How edit mode is toggled

The button click is handled by `toggleEditProfile()`:

```js
const toggleEditProfile = () => {
  if (isEditing) {
    setFormData(profileData);
    setError(false);
  }
  setIsEditing((prev) => !prev);
};
```

This means:
- if the page is already editing and the user clicks again, it resets the draft form values back to the saved `profileData`
- then it changes the state between editing and viewing

So the same button becomes both `Edit profile` and `Cancel edit` depending on `isEditing`.

## 5. Rendering view mode vs edit mode

Each profile row is rendered conditionally using `isEditing`.
For example, the full name field:

```js
{isEditing ? (
  <input
    name="fullName"
    value={formData.fullName}
    onChange={handleInputChange}
    disabled={isLoading}
  />
) : (
  <div>{profileData.fullName}</div>
)}
```

That pattern is repeated for all fields:
- `email`
- `username`
- `phone`
- `about`

This is the same style as `ViewPasswordModal`, where the UI switches based on `isEditing`.

## 6. Handling input changes

The `handleInputChange` function updates the draft form data every time the user types:

```js
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};
```

This is standard React form handling:
- `name` matches the field key in `formData`
- `value` is the typed text
- the object is copied with `...prev`, then the changed field is replaced

## 7. Saving updates

The update action happens in `handleUpdateProfile`:

```js
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(false);

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isSuccess = true;

    if (isSuccess) {
      setProfileData(formData);
      setIsEditing(false);
    } else {
      throw new Error("Unable to update profile. Please try again.");
    }
  } catch (err) {
    setError(true);
  } finally {
    setIsLoading(false);
  }
};
```

This function does the following:
1. prevents the form from reloading the page
2. marks the page as loading
3. resets any previous error
4. performs an async save (simulated with `setTimeout`)
5. if successful, copies `formData` into `profileData` and exits edit mode
6. if failed, sets `error` so the UI can show a message
7. always turns off loading when finished

## 8. The `Update` button

The `Update` button is shown only when `isEditing` is `true`:

```js
{isEditing && (
  <button type="submit" disabled={isLoading}>
    {isLoading ? "Updating..." : "Update"}
  </button>
)}
```

It uses `type="submit"` so pressing Enter in any field also submits the form.

## 9. Why this is a good pattern for new developers

This pattern separates concerns clearly:
- `profileData` is the saved state
- `formData` is the draft state
- `isEditing` controls the view/edit mode
- the button label is derived from state
- the same button handles both opening and canceling edit mode

It also matches the `ViewPasswordModal` logic:
- one boolean decides whether fields are inputs or text
- `Cancel` returns to view mode without saving
- `Update` saves and exits edit mode

## 10. How props are passed (for the button)

`ProfilePage` passes these props into `EditProfileButton`:
- `onClick={toggleEditProfile}`
- `label={isEditing ? "Cancel edit" : "Edit profile"}`

The button component does not own any profile logic.
It only renders the button and calls the function given by the parent.
That means the parent page still controls the entire edit flow.
