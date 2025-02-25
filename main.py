import tensorflow as tf
import tensorflow_datasets as tfds
import math
from tensorflow import keras

BATCH_SIZE = 32

def normalize(images, labels):
    return tf.cast(images, tf.float32) / 255, labels

def build_model():
    model = keras.Sequential([
        keras.Input(shape=(28, 28, 1)),
         keras.layers.Flatten(),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dense(10, activation='softmax'),
    ])
    return model

def main():
    dataset, metadata = tfds.load("mnist", as_supervised=True, with_info=True)
    train_dataset, test_dataset = dataset["train"], dataset["test"]

    num_train_examples = metadata.splits["train"].num_examples
    num_test_examples = metadata.splits["test"].num_examples

    train_dataset = (
        train_dataset.map(normalize).repeat().shuffle(num_train_examples).batch(BATCH_SIZE)
    )
    
    test_dataset = test_dataset.map(normalize).batch(BATCH_SIZE)

    model = build_model()

    # Compile and fit
    model.compile(
        optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"]
    )

    model.fit(
        train_dataset,
        epochs=10,
        steps_per_epoch=math.ceil(num_train_examples / BATCH_SIZE),
    )

    # Evaluate the model on the test dataset
    test_loss, test_accuracy = model.evaluate(
        test_dataset,
        steps=math.ceil(num_test_examples / BATCH_SIZE)
    )

    print("Test accuracy:", test_accuracy)

    # Save the final model
    model.save("final_model.h5")

if __name__ == '__main__':
    main()
