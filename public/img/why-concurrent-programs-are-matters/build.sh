#!/bin/sh
#for file in $(ls *.flowchart);
for file in $(ls *.mmd);
do
  #diagrams flowchart $file ${file%.flowchart}.svg
  mmdc -i $file -o ${file%.mmd}.svg
done
