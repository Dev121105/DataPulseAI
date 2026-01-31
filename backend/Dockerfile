#use the official python image
FROM python:3.11-alpine

#set the working directory in the container
WORKDIR /main

#copy the dependencies file to the working directory
COPY requirements.txt .

#install dependencies
RUN pip install -r requirements.txt

#copy the content of the local src directory to the working directory
COPY . .

#expose the port the app runs on
EXPOSE 8001

#run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
