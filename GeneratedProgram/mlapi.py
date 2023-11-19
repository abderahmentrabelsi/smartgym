# Bring in lightweight dependencies
import random

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the data
data = pd.read_json('ALL.json')
print(data.head())  # Check that data is loaded correctly


class Exercise(BaseModel):
    bodyPart: str
    equipment: str
    gifUrl: str
    id: str
    name: str
    target: str


class InputParams(BaseModel):
    gender: str
    age: float
    height: float
    weight: float
    fitnesslevel: int


def scoring_endpoint(item: InputParams):
    # Load the dataset
    data = pd.read_csv('UserInformations.csv')
    print(data.head())  # Check that data is loaded correctly

    # Convert categorical features to numerical
    data['gender'] = data['gender'].map({'male': 0, 'female': 1})

    # Train a random forest regressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(data[['age', 'fitnesslevel', 'gender']], data['difficulty'])

    # Predict the difficulty based on user input
    gender_num = 0 if item.gender == 'male' else 1
    user_input = [[item.age, item.fitnesslevel, gender_num]]
    predicted_difficulty = model.predict(user_input)
    return {'predicted_difficulty': predicted_difficulty[0]}


@app.post('/')
async def exercicesList(item: InputParams):
    score = scoring_endpoint(item)

    predicted_difficulty = score['predicted_difficulty']

    if predicted_difficulty <= 2:
        n = 1
    elif predicted_difficulty <= 4 and predicted_difficulty > 2:
        n = 2
    elif predicted_difficulty <= 6 and predicted_difficulty > 4:
        n = 3
    elif predicted_difficulty <= 8 and predicted_difficulty > 6:
        n = 4
    elif predicted_difficulty <= 10 and predicted_difficulty > 8:
        n = 5

    print(n)
    # Convert user's height from cm to meters
    height_m = item.height / 100

    # Calculate IMC
    imc = item.weight / (height_m ** 2)

    # Calculate lean body mass (LBM) using the Boer formula
    if item.gender == 'male':
        lbm = (0.407 * item.weight) + (0.267 * item.height) - 19.2
    else:
        lbm = (0.252 * item.weight) + (0.473 * item.height) - 48.3
    # Calculate fat mass (FM)
    fm = item.weight - lbm
    # Calculate IMG
    img = (fm / item.weight) * 100

    # Filter the data based on the input parameters
    abs = data.loc[
        (data['bodyPart'] == 'waist') & (data['target'] == 'abs')
        ].sample(n=n, random_state=random.seed())

    back = data.loc[
        (data['bodyPart'] == 'back')
    ].sample(n=n, random_state=random.seed())

    chest = data.loc[
        (data['bodyPart'] == 'chest')
    ].sample(n=n, random_state=random.seed())
    arms = data.loc[
        (data['target'] == 'biceps')
    ].sample(n=n, random_state=random.seed())
    arms = arms.append(
        data.loc[(data['target'] == 'triceps')
        ].sample(n=n, random_state=random.seed())
    )
    upperlegs = data.loc[
        (data['bodyPart'] == 'upper legs')
    ].sample(n=n, random_state=random.seed())
    N=3 if n>3 else n

    legs = data.loc[(data['bodyPart'] == 'lower legs')
    ].sample(n=N, random_state=random.seed())
    shoulders = data.loc[
        (data['bodyPart'] == 'shoulders')
    ].sample(n=n, random_state=random.seed())

    # Combine the filtered data into a single DataFrame
    filtered_data = pd.concat([chest, back, abs, shoulders, arms, upperlegs, legs])
    print(filtered_data)

    # Convert the filtered data to a list of Exercise objects
    exercises = [
        Exercise(**row.to_dict())
        for _, row in filtered_data.iterrows()
    ]

    return {"exercises": exercises, "score": score, "leanbodymass": lbm, "fatwheight": fm, "n": n}
