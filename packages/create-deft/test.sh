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
  pnpm i
#  pnpm i --registry https://registry.npmjs.org/
  npm run build
  cd ../..
  if [ -d "test/$tpl/target" ]; then
    mv "test/$tpl/target" "test/target"
  fi
}

npm run build
mkdir -p test
test_tpl solid-ts
test_tpl solid
test_tpl react-ts
test_tpl vanilla-ts
test_tpl react
test_tpl vanilla
test_tpl vue-ts
test_tpl vue