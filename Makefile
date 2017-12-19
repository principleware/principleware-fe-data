include Makefile.inc

DST_DIR := dist
SRC_DIR := src

PACKAGE_SOURCES := $(SRC_DIR)/decorators/interfaces.ts \
 $(SRC_DIR)/decorators/observable.decorator.ts 

PACKAGE_TARGETS := $(subst src,dist,$(PACKAGE_SOURCES))

# rules

$(DST_DIR)/decorators/%.ts: $(SRC_DIR)/decorators/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

prepare_dir:
	echo "Preparing directory ..."
	rm -rf $(DST_DIR)
	echo "Generating dist ..."

$(PACKAGE_TARGETS): | prepare_dir

dist: $(PACKAGE_TARGETS)
	echo "Copying package...."
	$(CP) $(CPFlALGS) dist-package.json $(DST_DIR)/package.json


test:
	echo $(PACKAGE_SOURCES)
	echo $(PACKAGE_TARGETS)


