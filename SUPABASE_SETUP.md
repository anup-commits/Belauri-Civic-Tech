# Supabase Setup Guide for Belauri First

Follow these steps to configure your Supabase project for the Belauri First website.

## 1. Run the SQL Script
1. Open your Supabase Dashboard.
2. Go to the **SQL Editor** on the left menu.
3. Open `supabase/setup.sql` from your project folder, copy its contents, and paste it into the SQL Editor.
4. Click **Run** in the bottom right corner.
   *(This will create the `posts` table, enable Row Level Security, apply correct policies, create a `post-images` storage bucket with its policies, and enable Realtime for the `posts` table.)*

## 2. Enable Anonymous Auth
1. In the Supabase Dashboard, go to **Authentication** > **Providers**.
2. Scroll to the bottom and enable **Anonymous Sign-ins**.
3. Click "Save". 
   *(This is crucial because public users submit stories without creating accounts; they are assigned an anonymous `auth.uid()` under the hood.)*

## 3. Create Secret Admin User
1. In the Supabase Dashboard, go to **Authentication** > **Users**.
2. Click **Add user** > **Create new user**.
3. Create an admin user (e.g., `admin@belauri.org`) and generate a secure password.
4. *Remember these credentials! You will need them to log into the `/secret-admin-belauri` dashboard.*

## 4. Get Keys for the App
1. Go to **Project Settings** (gear icon) > **API**.
2. Copy the `Project URL` and `anon public` key.
3. In your project root folder (`d:\project`), create a `.env.local` file.
4. Add your keys to the `.env.local` file like this:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 5. (Optional) Run the App Locally
1. Run `npm install` in the project root.
2. Run `npm run dev` to start the local server.
3. Open the printed localhost URL in your browser.
