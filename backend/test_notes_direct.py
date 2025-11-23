"""
Direct test of note_service without HTTP server.
Tests Supabase Storage integration.
"""

import asyncio
import uuid
from dotenv import load_dotenv
import sys
import os

# Load environment variables
load_dotenv()

# Add app to path so we can import
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from services.note import note_service


async def test_note_lifecycle():
    """Test complete CRUD lifecycle of a note."""

    print("\n" + "="*60)
    print("🧪 TESTING NOTE SERVICE - DIRECT SUPABASE CONNECTION")
    print("="*60 + "\n")

    # Generate test data
    test_file_id = str(uuid.uuid4())
    test_title = "Test Note - Neural Networks"
    test_content = """# Neural Networks

## Introduction
This is a test note about neural networks.

## Key Concepts
- Perceptrons
- Backpropagation
- Activation functions

## Example Code
```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))
```
"""
    test_url = "https://en.wikipedia.org/wiki/Neural_network"

    try:
        # TEST 1: Create Note
        print("📝 TEST 1: Creating note...")
        print(f"   File ID: {test_file_id}")
        print(f"   Title: {test_title}")

        metadata = await note_service.create_note(
            file_id=test_file_id,
            title=test_title,
            content=test_content,
            url=test_url
        )

        print("✅ Note created successfully!")
        print(f"   Storage path: {metadata['storage_path']}")
        print(f"   Size: {metadata['size_bytes']} bytes")
        print(f"   Created at: {metadata['created_at']}\n")


        # TEST 2: Retrieve Note
        print("📖 TEST 2: Retrieving note...")

        retrieved = await note_service.get_note(test_file_id)

        print("✅ Note retrieved successfully!")
        print(f"   Title: {retrieved['title']}")
        print(f"   Content preview: {retrieved['content'][:100]}...")
        print(f"   URL: {retrieved['url']}\n")


        # TEST 3: Update Note
        print("✏️  TEST 3: Updating note...")

        updated_content = test_content + "\n\n## Updated Section\nThis was added in the update test."
        updated_title = "Updated: " + test_title

        updated_metadata = await note_service.update_note(
            file_id=test_file_id,
            content=updated_content,
            title=updated_title
        )

        print("✅ Note updated successfully!")
        print(f"   New title: {updated_metadata['title']}")
        print(f"   New size: {updated_metadata['size_bytes']} bytes")
        print(f"   Updated at: {updated_metadata['updated_at']}\n")


        # TEST 4: List Notes
        print("📋 TEST 4: Listing all notes...")

        notes = await note_service.list_notes(limit=10)

        print(f"✅ Found {len(notes)} note(s)")
        for note in notes:
            print(f"   - {note['title']} ({note['file_id'][:8]}...)")
        print()


        # TEST 5: Delete Note
        print("🗑️  TEST 5: Deleting test note...")

        await note_service.delete_note(test_file_id)

        print("✅ Note deleted successfully!\n")


        # Verify deletion
        print("🔍 TEST 6: Verifying deletion...")
        try:
            await note_service.get_note(test_file_id)
            print("❌ ERROR: Note still exists after deletion!")
        except Exception as e:
            # Expecting either FileNotFoundError or StorageApiError with 404
            if "not found" in str(e).lower() or "404" in str(e):
                print("✅ Confirmed: Note successfully deleted\n")
            else:
                raise


        print("="*60)
        print("🎉 ALL TESTS PASSED!")
        print("="*60)
        print("\n✨ Your Supabase Storage integration is working correctly!")
        print("   You can now use the API endpoints via HTTP.\n")

    except Exception as e:
        print(f"\n❌ TEST FAILED!")
        print(f"Error: {type(e).__name__}: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("   1. Check your .env file has valid SUPABASE_URL and SUPABASE_KEY")
        print("   2. Verify the 'notes' bucket exists in Supabase dashboard")
        print("   3. Ensure you're using the service_role key (not anon key)")
        print("   4. Check Supabase project is active and accessible\n")
        raise


if __name__ == "__main__":
    asyncio.run(test_note_lifecycle())
