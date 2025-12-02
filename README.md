# Contractor Website

This is a static website designed for a residential contractor. It is built to be fast, secure, and easy to maintain with full ownership.

## Features

*   **Responsive Design:** Looks good on mobile, tablet, and desktop.
*   **Gallery:** Showcase your work with a grid layout and hover effects.
*   **Contact Form:** Integrated with Netlify Forms for easy lead collection.
*   **CMS (Optional):** Pre-configured for Netlify CMS to allow easy content editing without touching code.

## Folder Structure

*   `index.html`: The main homepage containing all sections (Hero, About, Gallery, Contact).
*   `assets/`: Contains styles (`styles.css`), scripts (`main.js`), and images.
*   `admin/`: Configuration for Netlify CMS.

## How to Edit Content

### Option 1: Editing Code Directly

1.  **Text:** Open `index.html` in any text editor. Look for the text you want to change and edit it.
2.  **Images:**
    *   Place new images in `assets/images/`.
    *   In `index.html`, find the gallery section and duplicate a `.gallery-item` block.
    *   Update the `src` attribute (currently using placeholders) to point to your new image, e.g., `assets/images/kitchen.jpg`.

### Option 2: Using Netlify CMS (If enabled)

1.  Go to `yourdomain.com/admin`.
2.  Login with your credentials.
3.  Use the interface to update text and upload new gallery images.

## Deployment

This site is ready to be deployed on **Netlify**.

1.  Create a Netlify account.
2.  Select "New site from Git".
3.  Connect your GitHub repository.
4.  **Build settings:**
    *   Build command: (Leave empty)
    *   Publish directory: `contractor-site` (or root if you moved files up)
5.  Click "Deploy site".

## Form Handling

The contact form is pre-configured for Netlify Forms.
*   Add `data-netlify="true"` to the form tag (already done).
*   Submissions will appear in your Netlify dashboard under "Forms".

## Ownership Transfer

To transfer this to the contractor:
1.  **GitHub:** Settings -> General -> Transfer ownership.
2.  **Netlify:** Site settings -> General -> Transfer site.
