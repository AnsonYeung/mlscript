#!/bin/bash

for file in hkmc2/shared/src/test/mlscript-compile/nofib/*.mjs; do
  name=`basename $file .mjs`
  uncomp_size=`stat -c %s $file`
  gzip -k -f $file
  comp_size=`stat -c %s $file.gz`
  echo "$name,$uncomp_size,$comp_size"
done
