include Makefile.inc

DST_DIR := src
SRC_DIR := host

PACKAGE_SOURCES := $(SRC_DIR)/interfaces/event-args.interface.ts \
 $(SRC_DIR)/interfaces/event-args.interface.ts \
 $(SRC_DIR)/interfaces/observable.interface.ts \
 $(SRC_DIR)/decorators/observable.decorator.ts 

PACKAGE_TARGETS := $(subst src,dist,$(PACKAGE_SOURCES))

# rules

$(DST_DIR)/decorators/%.ts: $(SRC_DIR)/decorators/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/interfaces/%.ts: $(SRC_DIR)/interfaces/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

prepare_dir:
	echo "Preparing directory ..."
	rm -rf $(DST_DIR)
	echo "Generating src ..."

$(PACKAGE_TARGETS): | prepare_dir

dist: $(PACKAGE_TARGETS)

test:
	echo $(PACKAGE_SOURCES)
	echo $(PACKAGE_TARGETS)


