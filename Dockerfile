# Use an official Python runtime as the base image
FROM python:3.10.6

# Set the working directory in the container
WORKDIR /app/backend/

# Copy the contents of the backend/ directory into the container
COPY backend/ /app/backend/

# Install the required dependencies for your Flask app
RUN pip install -r /app/backend/requirements.txt

# Set the environment variable for Flask
ENV FLASK_APP=app.py

# Expose the port your Flask app will run on (you may adjust this if needed)
EXPOSE 5000

# Start the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
