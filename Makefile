include Makefile.inc

DST_DIR := src
SRC_DIR := host

PACKAGE_SOURCES := $(SRC_DIR)/interfaces/event-args.interface.ts \
 $(SRC_DIR)/interfaces/joint-point.interface.ts \
 $(SRC_DIR)/interfaces/observable.interface.ts \
 $(SRC_DIR)/decorators/observable.decorator.ts \
 $(SRC_DIR)/cache/cache-backend.interface.ts \
 $(SRC_DIR)/cache/memory-backend.ts \
 $(SRC_DIR)/cache/sliding-expiration-cache.ts \
 $(SRC_DIR)/relational/dummy-records.ts \
 $(SRC_DIR)/relational/interfaces.ts \
 $(SRC_DIR)/relational/table.ts \
 $(SRC_DIR)/relational/database.ts \
 $(SRC_DIR)/backend/interfaces.ts \
 $(SRC_DIR)/backend/event-hub.ts \
 $(SRC_DIR)/backend/provider.ts

PACKAGE_TARGETS := $(subst $(SRC_DIR),$(DST_DIR),$(PACKAGE_SOURCES))

# rules

$(DST_DIR)/decorators/%.ts: $(SRC_DIR)/decorators/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/interfaces/%.ts: $(SRC_DIR)/interfaces/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/cache/%.ts: $(SRC_DIR)/cache/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/relational/%.ts: $(SRC_DIR)/relational/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/backend/%.ts: $(SRC_DIR)/backend/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@


prepare_dir:
	echo "Preparing directory ..."
#	rm -rf $(DST_DIR)
	echo "Generating src ..."

$(PACKAGE_TARGETS): | prepare_dir

publish: $(PACKAGE_TARGETS)

test:
	echo $(PACKAGE_SOURCES)
	echo $(PACKAGE_TARGETS)


