import duckdb
import json
import os
import requests
import os
from  glob import glob

# Path to your DuckDB database file
db_path = '../data/data.db'

if len(glob("../data/*.db")) == 0:
  print("Database file is missing.. downloading...")
  with open(os.path.abspath(db_path),"wb") as f:
    f.write(requests.get("").content)
  print("Finished downloading..")

from flask import Flask, jsonify, request,render_template
app = Flask(__name__)

db_path = os.path.abspath('../data/data.db')
# Connect to DuckDB
con = duckdb.connect(db_path,read_only=True)
print("Dictionary loaded!")

# Define a simple GET endpoint for lookup by ID
@app.route('/')
def index():
  return render_template("/index.html")
# Define a simple GET endpoint for lookup by ID
@app.route('/api/v1/lookup')
def lookup():
  try:
    # Build the SQL query
    search = request.args.get('search','').replace("'","''")
    if search != '':
      query = f"SELECT distinct word FROM data WHERE word ilike '%{search}%' order by len(word) limit 50 "

      # Execute the query and fetch all results
      result = con.execute(query).fetch_df().to_json(orient='records')
    # Check if results exist
    if result:
      # Return the first row as JSON (modify as needed)
      return result
    else:
      return jsonify({"message": "Not Found"}), 404
  except Exception as e:
    print(f"Error executing query: {e}")
    return jsonify({"message": "Internal Server Error"}), 500

@app.route('/api/v1/define')
def define():
  try:
    # Build the SQL query
    word = request.args.get('word','').replace("'","''")
    
    if word != '':
      query = f"""SELECT *
                FROM data WHERE word ilike '{word}' order by array_length(senses) desc """

      # Execute the query and fetch all results
      result = con.execute(query).fetch_df().to_json(orient='records')
    # Check if results exist
    if result:
      # Return the first row as JSON (modify as needed)
      return result
    else:
      return jsonify({"message": "Not Found"}), 404
  except Exception as e:
    print(f"Error executing query: {e}")
    return jsonify({"message": "Internal Server Error"}), 500

if __name__ == '__main__':
  app.run(debug=False)
