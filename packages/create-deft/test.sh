#!/bin/bash
set -ue

function test_tpl() {
  tpl=$1
  echo "Testing $tpl"
  rm -rf test/$tpl
  npx create-deft -t "$tpl" --id "fun.kason.deft_demo" test/$tpl
  if [ -d "test/target" ]; then
    mv test/target test/$tpl/
  fi
  cd "test/$tpl"
  npm i
  npm run dev
  cd ../..
  mv "test/$tpl/target" "test/target"
}

npm run build
mkdir -p test
test_tpl vanilla
test_tpl vanilla-ts
test_tpl react
test_tpl react-ts