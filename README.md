# TrolStore

TrolStore is a humorous and entertaining e-commerce web application built with Node.js and MongoDB. Users can add products to their cart, chat with a witty chatbot, and create support requests. The environment is ready for you to view all your database records as well.

## Features

- 🛒 **Cart System:** Add products to your cart and keep track of your balance.
- 🤖 **Humorous Chatbot:** Get funny answers to frequently asked questions or ask your own.
- 📝 **Support Requests:** Easily submit refund or other support requests.
- 🔐 **User Login & Registration:** Secure sign-up and sign-in.
- ⚡ **Fast & Modern UI:** Responsive and user-friendly design.

## Installation

### Requirements

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or remote)

### Steps

1. **Clone the Project**
   ```sh
   git clone https://github.com/yourusername/TrolStore.git
   cd TrolStore
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**

   Edit the `.env` file:
   ```
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
   MONGO_URI=mongodb://localhost:27017/trolstore
   ```

   > Note: The OpenAI API key is optional. It's required only for AI-powered humorous responses, but since AI learning cannot be restricted, the AI feature is disabled by default, so you do NOT need to set an API key.
   > If you wish, you can add your OpenAI key and activate AI support in the code.

4. **Start MongoDB**
   - Start the MongoDB service or connect using [MongoDB Compass](https://www.mongodb.com/products/compass).

5. **Load Initial Database Data (Optional)**
   ```sh
   node mongo-init.js
   ```

6. **Start the Server**
   ```sh
   node server.js
   ```

7. **Open the Application**
   - Go to [http://localhost:5000](http://localhost:5000) in your browser.

## Usage

- **Login/Register:** Register or log in as soon as you open the app.
- **Add Products to Cart:** Use the "Add to Cart" button under each product.
- **Chatbot:** Click the 🤖 icon in the bottom right to chat with the bot.
- **Support Request:** Use the "Create Support Request" option in the chatbot to submit your message.

## Developer Info

- **Creator:** [PartineS](https://github.com/PartineS)
- **License:** MIT

## Contributing

Contributions are welcome! Please send a pull request or open an issue.

---

