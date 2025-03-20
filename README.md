# Project Documentation

## Setup

Open two terminals: one for the frontend and one for the backend.  

- In the first terminal, navigate to the **client** folder and run:  
  ```bash
  npm start
  ```  
  This will start the frontend.  

- In the second terminal, navigate to the **server** folder and run:  
  ```bash
  dotnet run
  ```  
  This will start the backend.  

---

## Home Page

- You'll start on the **Home Page**, where you'll find options for **Login** and **Register**.  
- If you're already a registered user, click the **Login** button to go to the login page.  
- If you're a new user, click the **Register** button to go to the registration page.  


![Screenshot 2025-03-20 101007](https://github.com/user-attachments/assets/976edd75-dab0-4a99-86f6-4f9f78e0b61b)

---

## Register Page

- On the **Register Page**, you need to enter a **username** and **password**.  
- The **username** must be unique.  
- The **password** and **confirm password** fields must match.  
- By default, all registered users will have the role of **"user."**  
- An **admin role** can be assigned to a user through the database using:  

  ```sql
  UPDATE users SET role = 'admin' WHERE id = user_id;
  ```  

- After registering, you'll be redirected to the **Login Page**.  


![Screenshot 2025-03-20 101057](https://github.com/user-attachments/assets/3302fab4-abf4-496a-8842-7d6e36340395)

---

## Login Page

- On the **Login Page**, enter your **username** and **password**, then click the **Login** button.  
- If the credentials are correct, you'll be redirected to the **All Recipes** page.  


![Screenshot 2025-03-20 101130](https://github.com/user-attachments/assets/f7250cdc-1100-46ea-a513-39dba1311a7d)

---

## All Recipes Page

- On the **All Recipes Page**, you can view recipes added by all users.  
- The header contains a **navigation bar** with links to the **All Recipes** page and the **My Recipes** page.  
- It also displays the currently **signed-in user** and provides a **Logout** option.  
- You can refresh the list using the **Refresh** button.  

### Access Control:
- **Admins** have options to **edit** and **delete** any recipe.

  ![Screenshot 2025-03-20 101540](https://github.com/user-attachments/assets/08426ba8-0d98-4c14-918d-26b2e3dbc2e1)

- **Users** can only manage their own recipes on the **My Recipes Page**.  


![Screenshot 2025-03-20 101615](https://github.com/user-attachments/assets/53b679c3-5cb8-43fd-a1e9-61a3ebd07f8f)

---

## My Recipes Page

- Clicking on the **My Recipes Page** in the navbar will redirect you to the **My Recipes Page**.  
- Here, you can view all the recipes you've added.  
- You can **view, edit, and delete** your recipes.  
- To add a new recipe, click the **Add New Recipe** button.  


![Screenshot 2025-03-20 101715](https://github.com/user-attachments/assets/fd06ec2b-f4b8-4685-998f-e46e14196d62)

---

## Add New Recipe

- Clicking the **Add New Recipe** button will display a **form modal**.  
- In the form, you need to fill in:  
  - **Recipe Name**  
  - **Category**  
  - **Image Link**  
  - **Ingredients**  
  - **Instructions**  
- After entering the image link, a **preview** of the image will be displayed to verify if it's supported.  
- Click **Add Recipe** to submit the form.  


![Screenshot 2025-03-20 102112](https://github.com/user-attachments/assets/0e1629df-5f05-42da-b319-5618a0372de6)

---

## View Recipe

- Clicking the **View** button on a recipe card will display a **view modal**.  
- The modal will show:  
  - **Recipe Name**  
  - **Image**  
  - **Category**  
  - **Ingredients**  
  - **Instructions**  
- At the bottom, there will be options to **Edit, Delete, and Close** the modal.  


![Screenshot 2025-03-20 102201](https://github.com/user-attachments/assets/88f66234-425e-4058-9a28-b8f891d2bca5)


![Screenshot 2025-03-20 102232](https://github.com/user-attachments/assets/b4fb8e16-03df-4c92-be6a-6f519e19eac8)

---

## Edit Recipe

- Clicking the **Edit** button will display an **edit modal**.  
- This modal contains a **form** pre-filled with the recipe details.  
- You can modify the details and click **Save** to update the recipe.  
- The **Edit** option is available only to **admins** and the **user who created the recipe**.  


![Screenshot 2025-03-20 102320](https://github.com/user-attachments/assets/87365433-ca98-408b-a8f1-84176bd69443)


![Screenshot 2025-03-20 102338](https://github.com/user-attachments/assets/ce264834-8fc5-4a61-9668-3cf1f3acf3e5)

---

## Delete Recipe

- Clicking the **Delete** button will open a **delete modal**.  
- The modal will display a warning that the process is **irreversible** and ask:  

  **"Are you sure you want to delete it?"**  

- **Clicking OK** will delete the recipe.  
- **Clicking Cancel** will keep the recipe.  
- This option is available only to **admins** and the **user who created the recipe**.  


![Screenshot 2025-03-20 112251](https://github.com/user-attachments/assets/478839ce-5601-4081-b16d-71bba77d5ce9)

---

## Logout

- A **Logout** option is available in the header.  
- Clicking **Logout** will log you out and redirect you to the **Login Page**.

![Screenshot 2025-03-20 103949](https://github.com/user-attachments/assets/35dd5c39-2397-4078-aa9f-fd1a50051496)

