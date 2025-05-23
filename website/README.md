# YouTube Smart Chapters AI - Website

אתר מלא ליצירת פרקים חכמים לסרטוני YouTube באמצעות בינה מלאכותית.

## תכונות האתר

### 🎯 דפי האתר
- **דף בית** - הצגת השירות ויתרונותיו
- **עיבוד סרטון** - הדף הראשי לעיבוד סרטוני YouTube
- **אודות** - מידע מפורט על השירות והטכנולוגיות
- **צור קשר** - טופס יצירת קשר ושאלות נפוצות
- **הורדת תוסף** - הוראות התקנה והדרכה לתוסף Chrome
- **דף 404** - דף שגיאה ידידותי למשתמש

### 🚀 תכונות מתקדמות
- **ממשק בעברית** - תמיכה מלאה בעברית מימין לשמאל
- **עיצוב רספונסיבי** - מותאם לכל הגדלי מסך
- **אנימציות חלקות** - חוויית משתמש מתקדמת
- **SEO מותאם** - מטא-נתונים מלאים ואופטימיזציה
- **אבטחה** - הגדרות אבטחה מתקדמות

### 🎨 עיצוב ו-UX
- **עיצוב מודרני** - ממשק נקי ומקצועי
- **טיפוגרפיה עברית** - גופן Heebo מותאם
- **סכמת צבעים** - ורוד (#E91E63) וכתום (#FF5722)
- **איקונים ואמוג'י** - ממשק ויזואלי ברור
- **אינטראקטיביות** - כפתורים ואלמנטים אינטראקטיביים

## התקנה והרצה

### דרישות מקדימות
- Node.js 14.0.0 או יותר עדכן
- npm או yarn
- השרת הראשי פעיל על localhost:8000

### התקנה
```bash
# עבור לתיקיית האתר
cd website

# התקן dependencies
npm install

# או עם yarn
yarn install
```

### הרצה בפיתוח
```bash
# הפעל שרת פיתוח
npm start

# או עם yarn
yarn start
```

האתר יפתח באופן אוטומטי ב-http://localhost:3000

### בניה לפרודקשן
```bash
# בנה את האתר לפרודקשן
npm run build

# או עם yarn
yarn build
```

קבצי הפרודקשן יישמרו בתיקיית `build/`

### הרצה כפרודקשן
```bash
# התקן serve globally (פעם אחת)
npm install -g serve

# הרץ את האתר המובנה
serve -s build -l 3000
```

## מבנה הפרויקט

```
website/
├── public/
│   ├── index.html          # HTML בסיסי עם מטא-נתונים
│   └── ...                 # קבצים סטטיים נוספים
├── src/
│   ├── index.js            # נקודת כניסה של React
│   ├── App.js              # קומפוננט ראשי וניתוב
│   ├── styles/
│   │   └── index.css       # עיצוב מלא של האתר
│   └── components/
│       ├── layout/
│       │   ├── Header.js   # כותרת עליונה וניווט
│       │   └── Footer.js   # כותרת תחתונה
│       └── pages/
│           ├── HomePage.js        # דף בית
│           ├── ProcessPage.js     # עיבוד סרטונים
│           ├── AboutPage.js       # אודות השירות
│           ├── ContactPage.js     # צור קשר
│           ├── ExtensionPage.js   # הורדת תוסף
│           └── NotFoundPage.js    # דף 404
├── package.json            # הגדרות פרויקט ותלויות
└── README.md              # המדריך הזה
```

## התאמה אישית

### שינוי צבעים
ערוך את הקובץ `src/styles/index.css` ושנה את המשתנים:
```css
/* צבעים עיקריים */
--primary-color: #E91E63;    /* ורוד */
--secondary-color: #FF5722;  /* כתום */
```

### הוספת דפים חדשים
1. צור קומפוננט חדש ב-`src/components/pages/`
2. הוסף route חדש ב-`src/App.js`
3. הוסף קישור בניווט ב-`src/components/layout/Header.js`

### שינוי תוכן
כל התוכן נמצא בקומפוננטים הרלוונטיים ב-`src/components/pages/`

## אינטגרציה עם השרת

האתר מתחבר לשרת ב-localhost:8000 עבור:
- עיבוד סרטוני YouTube
- יצירת תמלולים
- ניתוח תוכן ויצירת פרקים
- יצירת מטא-נתונים

### הגדרת כתובת שרת
ערוך את `package.json` ושנה את השורה:
```json
"proxy": "http://localhost:8000"
```

## פריסה (Deployment)

### Netlify
1. בנה את הפרויקט: `npm run build`
2. העלה את תיקיית `build/` ל-Netlify
3. הגדר redirects עבור React Router

### Vercel
1. התחבר לפרויקט ב-Vercel
2. הגדר build command: `npm run build`
3. הגדר output directory: `build`

### Apache/Nginx
1. בנה את הפרויקט: `npm run build`
2. העתק את תיקיית `build/` לשרת
3. הגדר redirects עבור React Router

## תמיכה ופתרון בעיות

### בעיות נפוצות

**האתר לא נטען:**
- בדוק שהשרת פועל על localhost:8000
- בדוק שאין שגיאות ב-console

**שגיאות API:**
- וודא שהשרת הראשי פועל
- בדוק את הגדרות ה-proxy ב-package.json

**בעיות עיצוב:**
- נקה cache הדפדפן
- בדוק ש-CSS נטען כראוי

### לוגים ודיבוג
```bash
# הרץ עם לוגים מפורטים
npm start -- --verbose

# בדוק שגיאות בניה
npm run build -- --verbose
```

## תרומה לפרויקט

1. Fork את הפרויקט
2. צור branch חדש: `git checkout -b feature/amazing-feature`
3. בצע commit: `git commit -m 'Add amazing feature'`
4. Push ל-branch: `git push origin feature/amazing-feature`
5. פתח Pull Request

## רישיון

פרויקט זה מוגן תחת רישיון MIT - ראה קובץ LICENSE למידע נוסף.

## קישורים

- [פרויקט ראשי](../README.md)
- [תוסף Chrome](../client/README.md)
- [שרת](../server/README.md)
- [GitHub Repository](https://github.com/yaskovbs/YouTube_Smart_Chapters_AI)

---

פותח עם ❤️ באמצעות React, AssemblyAI ו-OpenAI
