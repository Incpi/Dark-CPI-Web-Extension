#!/bin/bash

echo "Remove old zip file..."
rm -f ./bin/*.zip

echo "Zipping files..."
7z a -r ./bin/Dark_CPI_Extension.zip *