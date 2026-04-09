# Profile Picture Upload Flow

This document explains how the profile picture upload logic works in `src/app/profile/page.jsx`.
It covers the default fallback, the file input flow, and how the profile image state moves between view and edit mode.

## 1. What this feature does

- shows a profile picture if one exists
- uses `/images/default-profile.png` when no profile picture is available
- allows the user to click the profile picture only in edit mode
- opens the system file picker to select a new image
- previews the selected image immediately
- saves the image together with the profile data when the user clicks `Update`

## 2. How the state is stored

The page uses `initialProfile` to define the default profile values:

```js
const initialProfile = {
  fullName: "Edward C. Gatbonton",
  email: "edwardgatbonton13@gmail.com",
  profileImage: "/images/default-profile.png",
  phone: "+63 912 345 6789",
  address: "Poblacion 4, Victoria, Oriental Mindoro",
};
```

Important: `profileImage` is included there, so the page always has a valid image source.

The component also has two pieces of state:

- `profileData` — the saved profile shown in view mode
- `formData` — the draft profile values used while editing

This is the same edit pattern used for the other profile fields.

## 3. How the image selection works

A hidden file input is used to let the user pick an image:

```jsx
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleProfileImageChange}
/>
```

The visible profile image is rendered as a button:

```jsx
<button type="button" onClick={handleProfileImageClick} disabled={!isEditing}>
  ...
</button>
```

When the user clicks the image and `isEditing` is true, the button triggers the hidden file input using `fileInputRef.current?.click()`.

## 4. Reading the selected file

When the user selects a file, `handleProfileImageChange` runs:

```js
const handleProfileImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result || "/images/default-profile.png";
    setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
  };
  reader.readAsDataURL(file);
};
```

This reads the file as a data URL and stores it in `formData.profileImage`. The image is previewed immediately because the `src` uses `formData.profileImage` while editing.

## 5. Displaying the profile image

The image element uses either the draft `formData.profileImage` in edit mode or the saved `profileData.profileImage` in view mode:

```jsx
<img
  src={isEditing ? formData.profileImage : profileData.profileImage}
  alt="Profile"
  className="h-full w-full object-cover"
/>
```

If no image is available, the initial default image path ensures the UI still shows a valid image.

## 6. Saving the image

When the user clicks `Update`, the existing save logic runs:

```js
setProfileData(formData);
setIsEditing(false);
displayToaster("success", "Profile updated successfully!");
```

Because `formData` also contains `profileImage`, the new image becomes part of the saved profile.

## 7. Default fallback behavior

If the user never uploads an image, `profileData.profileImage` stays set to:

```js
"/images/default-profile.png";
```

That file is served from `public/images/default-profile.png`.

## 8. Why this is a minimal change

This implementation keeps the existing profile edit form structure intact and adds only:

- a `profileImage` field to the profile state
- a hidden file input
- a click handler for the profile image
- a file reader to preview the uploaded image

No major refactor was required.
