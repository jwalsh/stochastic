#!/bin/sh

for CSV in trial-final-*.csv
do

    echo "
a <-read.csv(\"$CSV\", header = FALSE)
plot(a)
png(\"$CSV.png\")
plot(a)
" > $CSV.r

done
