# 🥘 UlamApp: AI-Powered Filipino Recipe Generator

**UlamApp** is an intelligent kitchen companion designed to help you decide *“Anong ulam?”* (What’s for dinner?) by generating Filipino recipe suggestions based on the ingredients you already have in your pantry.

Built with **React**, **Vite**, and **Tailwind CSS**, and powered by **Google Gemini AI**, UlamApp takes the guesswork out of cooking by providing personalized recipe recommendations, complete with cooking instructions, nutritional info, and estimated costs.

## 🚀 Features

  * **🛒 Pantry-Based Suggestions:** Input the ingredients you have (e.g., *chicken, garlic, soy sauce*), and the AI suggests dishes you can cook.
  * **🤖 AI Chef Integration:** Uses Google Gemini to generate detailed recipes, including cooking steps, chef's notes, and nutritional values.
  * **🖼️ Visual Recipe Cards:** Automatically fetches appetizing images for suggested dishes using a custom search API.
  * **💾 Save Your Favorites:** Keep a personal cookbook by saving recipes you love for quick access later.
  * **🥗 Dietary & Budget Preferences:**
      * **Healthy Mode:** Filters for healthier, vegetable-heavy, or less oily options.
      * **Budget & Pax Control:** Set a budget limit (in PHP) and specify the number of people you are cooking for.
  * **🇵🇭 Bilingual Support:** Toggle between **English** and **Tagalog/Filipino** for a localized experience.
  * **📱 Mobile-Responsive Design:** A beautiful, responsive UI that works perfectly on desktops, tablets, and mobile phones.

## 🛠️ Tech Stack

  * **Frontend:** [React](https://react.dev/) (v19), [Vite](https://vitejs.dev/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4), [Lucide React](https://lucide.dev/) (Icons)
  * **AI & Data:** [Google Gemini API](https://ai.google.dev/) (Generative AI), [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview) (Image fetching)
  * **State Management:** React `useState` & `useEffect` (with LocalStorage persistence)

## 📦 Installation

Follow these steps to set up the project locally.

1.  **Clone the repository**

    ```bash
    git clone https://github.com/herodot0s/ulamapp.git
    cd ulamapp
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your API keys:

    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_SEARCH_API_KEY=your_google_custom_search_api_key
    VITE_SEARCH_ENGINE_ID=your_search_engine_id
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

## 📂 Project Structure

```text
ulamapp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── views/       # Main application views (Home, Results, Saved, etc.)
│   │   ├── Header.jsx   # Top navigation bar
│   │   ├── RecipeView.jsx # Detailed recipe display
│   │   └── ...
│   ├── data/            # Mock data and constants
│   ├── services/        # API integration (Gemini & Image Search)
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application controller
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (not committed)
└── package.json         # Project dependencies
```

## 📖 Usage

1.  **Add Ingredients:** Type ingredients into the search bar (e.g., "Pork, Kangkong") and click **Add**.
2.  **Customize Settings:** Toggle "Healthy Mode" or set a budget and number of people (pax).
3.  **Generate:** Click the **"Curate Menu"** (or *Maghanap ng Ulam*) button.
4.  **View & Cook:** Browse the suggestions, click on a card to see the full recipe, and follow the step-by-step instructions.
5.  **Save:** Click the heart icon ❤️ to save a recipe to your personal collection.

## 🤝 Contributing

Contributions are welcome\! If you have suggestions for improvements or new features:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

## 👨‍💻 Authors

  * **SFIT-2B Students "Watchdogs" ** - *Quezon City University*

-----
