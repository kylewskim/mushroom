import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.svm import SVC
import joblib
import warnings

warnings.filterwarnings("ignore", message="X does not have valid feature names")

# Load the data into a pandas DataFrame
df = pd.read_csv("mushrooms.csv")

# Split the data into features (X) and target (y)
X = df[
    [
        "cap-color",
        "bruises",
        "gill-color",
        "stalk-color-above-ring",
        "stalk-color-below-ring",
        "ring-type",
        "veil-color",
    ]
]
y = df["class"]

# Apply one-hot encoding to the categorical features
X_encoded = pd.get_dummies(X)
X_encoded.columns = X_encoded.columns.astype(str)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42
)

# Train an SVM classifier on the training set
classifier = SVC()
classifier.fit(X_train, y_train)

Xnew_encoded = pd.get_dummies(pd.DataFrame(X_test, columns=X.columns))
Xnew_encoded = Xnew_encoded.reindex(columns=X_encoded.columns, fill_value=0)

prediction = classifier.predict(Xnew_encoded)

joblib.dump(classifier, "classifier.joblib")
