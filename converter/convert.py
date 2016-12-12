#!/bin/python
"""
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA

Copyright (c) 2016 Joshua Katz
"""


from os.path import isfile
import sys
import re
import subprocess
import json

QUESTION_PATTERN = "(\w\d\w\d\d) \((\w)\) ?(\[[\w\d \-\(\),\.]+\]?)?\n([/\-\-\,\"\“\”’\'\;\:\?\.\-\s\w\d\n\(\)]+)A\. ([\w\s\d,\$\:\;\.\?\-\n/\\’'\(\)\“\”\"\"]+)B\. ([\w\s\d,\$\:\;\.\?\-\n/\\’'\(\)\“\”\"\"]+)C\. ([\w\s\d,\$\:\;\.\?\-\n/\\’'\(\)\“\”\"\"]+)D\. ([\w\s\d,\$\:\;\.\?\-\n/\\’'\(\)\“\”\"\"]+)"
GROUP_NAMES = ["id", "correct", "legislation", "questions", "A", "B", "C", "D"]

def make_storable(id, correct, legislation, question, answers):
	return {
		"id": id,
		"correct": correct,
		"legislation": legislation,
		"question": question,
		"answers": answers
	}

def get_text(file_name):
	return str(subprocess.Popen(["antiword", file_name], stdout=subprocess.PIPE).stdout.read(), "utf-8")

def get_questions(file_name):
	text = get_text(file_name)
	for question in re.finditer(QUESTION_PATTERN, text, flags=re.IGNORECASE | re.MULTILINE):
		groups = [" ".join(question.group(i).split()) if question.group(i) else None for i in range(1, len(GROUP_NAMES) + 1)]
		yield {key: val for key, val in zip(GROUP_NAMES, groups)}


if __name__ == "__main__":
	if len(sys.argv) != 3:
		print("{} <file_to_convert.doc> <file_output.json>".format(sys.argv[0]))
		exit(1)

	if not isfile(sys.argv[1]):
		print("{} is not a real file".format(sys.argv[1]))
		exit(1)

	with open(sys.argv[2], "w") as o:
		questions = [q for q in get_questions(sys.argv[1])]
		print("Found {} questions in {}".format(len(questions), sys.argv[1]))
		o.write(json.dumps(questions))
