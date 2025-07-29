#!/bin/bash

# Create the combined thesis document
cat > thesis-final.md << 'THESIS_START'
---
title: "Πτυχιακή Εργασία: Σχεδιασμός και Υλοποίηση της Πλατφόρμας Watchable"
author: "[Όνομα Φοιτητή]"
date: "[Ημερομηνία]"
toc: true
documentclass: article
geometry: margin=2.5cm
fontsize: 12pt
linestretch: 1.5
lang: el-GR
---

THESIS_START

# Append each chapter without the problematic separators
sed 's/^---$//' 0.2-perilipsi.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 0.1-periexomena.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 01-eisagogi.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 02-theoritiko-ypovathro.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 03-apaitiseis-sxediasmos.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 04-ylopoiisi.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 05-elegxos-axiologisi.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 06-apotelesmata-paratiriseis.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 07-symperasmata.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 08-vivliografia.md >> thesis-final.md
echo -e "\n\n" >> thesis-final.md

sed 's/^---$//' 09-parartimata.md >> thesis-final.md

echo "Thesis files combined successfully!"
