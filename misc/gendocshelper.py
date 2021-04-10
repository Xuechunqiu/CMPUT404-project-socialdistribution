with open("docs.yaml", "r") as f:
  a = f.readlines()
  with open("nohead.yaml", "w") as ff:
    for each in a[4:]:
      ff.write(each)