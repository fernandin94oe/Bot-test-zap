#!/bin/bash

verde='\033[1;32m'
vermelho='\e[1;31m'

primeira_vez=1

while true
do
  if [ $primeira_vez -eq 1 ]; then
      echo "${verde}botzin ativo${reset}"
  else
      echo "${verde}botzin reiniciado${vermelho}"
  fi

  node index.js
  sh loop.sh
  sleep 1
  primeira_vez=0
done