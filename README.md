## Project Structure

```
STADVDB_MCO2_GROUPC/
├── eduquery/               # Frontend React application
│   └── src/
│       ├── App.jsx         # Front page
│       └── ...             # Other files related to frontend
│   └── ...                 # Other files related to frontend
├── backend/                # Python based backend
│   ├── .env                # environtment variables
│   ├── app.py                # Contains the api and database connections
│   ├── requirements.txt      # All used imports for python
│   └── ...                  # Other files related to backend
├── sql_files/              # Database schema and data
│   ├── schema.sql         # Database structure
│   └── data.sql           # Sample Data
├──init.sql/               # Sets up the database so that it exists within docker
└── README.md              # Instructions, etc..
```

## BEFORE STARTING

```
Make sure you have an .env varaible in the backend folder

.env contents
DB_HOST=localhost
DB_NAME=university
DB_USER=postgres
DB_PASSWORD=whatever_your_password_is
DB_PORT=5432

FLASK_ENV=development
FLASK_DEBUG=True
VITE_API_URL=http://localhost:5000
```

## TO START

```
1. To start
docker-compose up --build (make sure you are at root)
```

## ACCESS

- **App**: http://localhost:5173
